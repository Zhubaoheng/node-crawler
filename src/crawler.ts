import { EventEmitter } from "events";
import { Cluster } from "./rateLimiter/index.js";
import { isBoolean, isFunction, setDefaults, flattenDeep, lowerObjectKeys, isNumber } from "./lib/utils.js";
import { getValidOptions, alignOptions, getCharset } from "./options.js";
import { getLogger } from "./logger.js";
import type { CrawlerOptions, RequestOptions, RequestConfig, CrawlerResponse } from "./types/crawler.js";
import { load } from "cheerio";
import seenreq from "seenreq";
import iconv from "iconv-lite";
import { GotInstance, GotFn } from "got";
// @todo: remove seenreq dependency
const log = getLogger();

// 缓存 got 实例
let gotInstance: GotInstance<GotFn> | null = null;

async function loadGot() {
  if (!gotInstance) {
    gotInstance = (await import("got")).default;
  }
  return gotInstance;
}

class Crawler extends EventEmitter {
    private _limiters: Cluster;
    private _UAIndex = 0;
    private _proxyIndex = 0;

    public options: CrawlerOptions;
    public seen: any;

    constructor(options?: CrawlerOptions) {
        super();
        const defaultOptions: CrawlerOptions = {
            maxConnections: 10,
            rateLimit: 0,
            priorityLevels: 10,
            skipDuplicates: false,
            homogeneous: false,
            method: "GET",
            forceUTF8: false,
            jQuery: true,
            priority: 5,
            retries: 2,
            retryInterval: 3000,
            timeout: 20000,
            isJson: false,
            silence: false,
            rejectUnauthorized: false, // set to "true" in production environment.
            userAgents: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36"
        };
        this.options = { ...defaultOptions, ...options };
        if (this.options.rateLimit! > 0) {
            this.options.maxConnections = 1;
        }
        if (this.options.silence) {
            log.settings.minLevel = 7;
        }

        this._limiters = new Cluster({
            maxConnections: this.options.maxConnections!,
            rateLimit: this.options.rateLimit!,
            priorityLevels: this.options.priorityLevels!,
            defaultPriority: this.options.priority!,
            homogeneous: this.options.homogeneous,
        });

        this.seen = new seenreq(this.options.seenreq);
        this.seen
            .initialize()
            .then(() => {
                log.debug("seenreq initialized");
            })
            .catch((error: unknown) => {
                log.error(error);
            });
        this.on("_release", () => {
            log.debug(`Queue size: ${this.queueSize}`);
            if (this._limiters.empty) this.emit("drain");
        });
    }

    private _detectHtmlOnHeaders = (headers: Record<string, unknown>): boolean => {
        const contentType = headers["content-type"] as string;
        if (/xml|html/i.test(contentType)) return true;
        return false;
    };

    private _schedule = (options: CrawlerOptions): void => {
        this.emit("schedule", options);
        this._limiters
            .getRateLimiter(options.rateLimiterId)
            .submit(options.priority as number, (done, rateLimiterId) => {
                options.release = () => {
                    done();
                    this.emit("_release");
                };
                options.callback = options.callback || options.release;

                if (rateLimiterId) {
                    this.emit("limiterChange", options, rateLimiterId);
                }

                if (options.html) {
                    options.url = options.url ?? "";
                    this._handler(null, options, { body: options.html, headers: { "content-type": "text/html" } });
                } else {
                    options.url = options.url ?? options.uri;
                    if (typeof options.url === "function") {
                        options.url((url: string) => {
                            options.url = url;
                            this._execute(options);
                        });
                    } else {
                        delete options.uri;
                        this._execute(options);
                    }
                }
            });
    };

    private _execute = async (options: CrawlerOptions): Promise<CrawlerResponse> => {
        if (options.proxy) log.debug(`Using proxy: ${options.proxy}`);
        else if (options.proxies) log.debug(`Using proxies: ${options.proxies}`);

        options.headers = options.headers ?? {};
        options.headers = lowerObjectKeys(options.headers);

        if (options.forceUTF8 || options.isJson) options.encoding = "utf8";

        if (Array.isArray(options.userAgents)) {
            this._UAIndex = this._UAIndex % options.userAgents.length;
            options.headers["user-agent"] = options.userAgents[this._UAIndex];
            this._UAIndex++;
        } else {
            options.headers["user-agent"] = options.headers["user-agent"] ?? options.userAgents;
        }

        if (!options.proxy && Array.isArray(options.proxies)) {
            this._proxyIndex = this._proxyIndex % options.proxies.length;
            options.proxy = options.proxies[this._proxyIndex];
            this._proxyIndex++;
        }

        const request = async () => {
            if (options.skipEventRequest !== true) {
                this.emit("request", options);
            }
            let response: CrawlerResponse;
            try {
                const got = await loadGot(); // 动态加载 got
                response = await got(alignOptions(options));
            } catch (error) {
                log.debug(error);
                return this._handler(error, options);
            }
            return this._handler(null, options, response);
        };

        if (isFunction(options.preRequest)) {
            try {
                options.preRequest!(options, async (err?: Error | null) => {
                    if (err) {
                        log.debug(err);
                        return this._handler(err, options);
                    }
                    return await request();
                });
            } catch (err) {
                log.error(err);
                throw err;
            }
        } else {
            return await request();
        }
    };

    private _handler = (error: unknown, options: RequestOptions, response?: CrawlerResponse): CrawlerResponse => {
        if (error) {
            if (options.retries && options.retries > 0) {
                log.warn(`${error} occurred on ${options.url}. ${options.retries ? `(${options.retries} retries left)` : ""}`);
                setTimeout(() => {
                    options.retries!--;
                    this._execute(options as CrawlerOptions);
                }, options.retryInterval);
                return;
            } else {
                log.error(`${error} occurred on ${options.url}. Request failed.`);
                if (options.callback && typeof options.callback === "function") {
                    return options.callback(error, { options }, options.release);
                } else {
                    throw error;
                }
            }
        }
        if (!response.body) response.body = "";
        log.debug("Got " + (options.url || "html") + " (" + response.body.length + " bytes)...");
        response.options = options;

        response.charset = getCharset(response.headers);
        if (!response.charset) {
            const match = response.body.toString().match(/charset=['"]?([\w.-]+)/i);
            response.charset = match ? match[1].trim().toLowerCase() : null;
        }
        log.debug("Charset: " + response.charset);

        if (options.encoding !== null) {
            options.encoding = options.encoding ?? response.charset ?? "utf8";
            try {
                if (!Buffer.isBuffer(response.body)) response.body = Buffer.from(response.body);
                response.body = iconv.decode(response.body, options.encoding as string);
                response.body = response.body.toString();
            } catch (err) {
                log.error(err);
            }
        }

        if (options.isJson) {
            try {
                response.body = JSON.parse(response.body);
            } catch (_err) {
                log.warn("JSON parsing failed, body is not JSON. Set isJson to false to mute this warning.");
            }
        }

        if (options.jQuery === true && !options.isJson) {
            if (response.body === "" || !this._detectHtmlOnHeaders(response.headers)) {
                log.warn("response body is not HTML, skip injecting. Set jQuery to false to mute this warning.");
            } else {
                try {
                    response.$ = load(response.body);
                } catch (_err) {
                    log.warn("HTML detected failed. Set jQuery to false to mute this warning.");
                }
            }
        }

        if (options.callback && typeof options.callback === "function") {
            return options.callback(null, response, options.release);
        }
        return response;
    };

    public get queueSize(): number {
        return 0;
    }

    public setLimiter(rateLimiterId: number, property: string, value: unknown): void {
        if (!isNumber(rateLimiterId)) {
            log.error("rateLimiterId must be a number");
            return;
        }
        if (property === "rateLimit") {
            this._limiters.getRateLimiter(rateLimiterId).setRateLimit(value as number);
        }
        // @todo other properties
    }

    public send = async (options: RequestConfig): Promise<CrawlerResponse> => {
        options = getValidOptions(options);
        options.retries = options.retries ?? 0;
        setDefaults(options, this.options);
        options.skipEventRequest = isBoolean(options.skipEventRequest) ? options.skipEventRequest : true;
        delete options.preRequest;
        return await this._execute(options);
    };

    public direct = async (options: RequestConfig): Promise<CrawlerResponse> => {
        return await this.send(options);
    };

    public add = (options: RequestConfig): void => {
        let optionsArray = Array.isArray(options) ? options : [options];
        optionsArray = flattenDeep(optionsArray);
        optionsArray.forEach(options => {
            try {
                options = getValidOptions(options) as RequestOptions;
            } catch (err) {
                log.warn(err);
                return;
            }
            setDefaults(options, this.options);
            options.headers = { ...this.options.headers, ...options.headers };
            if (!this.options.skipDuplicates) {
                this._schedule(options as CrawlerOptions);
                return;
            }

            this.seen
                .exists(options, options.seenreq)
                .then((rst: any) => {
                    if (!rst) {
                        this._schedule(options as CrawlerOptions);
                    }
                })
                .catch((error: unknown) => log.error(error));
        });
    };

    public queue = (options: RequestConfig): void => {
        return this.add(options);
    };
}

export default Crawler;