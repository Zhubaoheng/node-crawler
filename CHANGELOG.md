node-crawler ChangeLog
-------------------------
2.0.3
- Add support for legacy code written using crawler v1.

2.0.2
- Add **Global Only Options : `silence`** to mute all crawler messages, including warnings and errors.
- Change default error message when request failed in **Crawler.add**
- Update dependencies

2.0.1
- [#474](https://github.com/bda-research/node-crawler/issues/474) Solve the 'userAgents' is not working
- Add some unit tests
- Migration from Mocha to AVA
- Use c8 to add code coverage report
- Update dependencies
- Others

2.0.0
- Crawler V2 has been released, which is a complete rewrite of the original crawler. 
- see [README.md](https://github.com/bda-research/node-crawler/blob/master/README.md) for details.

1.5.0
- fix bug of `:path` and `:authority` header in http/2 (@mike442144)
- add `ciphers` to both http/1.1 and http/2 (@mike442144)

1.4.0
- [#437](https://github.com/bda-research/node-crawler/pull/437) Update README.md (@kxxxo)
- [#420](https://github.com/bda-research/node-crawler/pull/420) Fast stack buffer sync spider crawl example (@j-mendez)
- [#395](https://github.com/bda-research/node-crawler/pull/395) Fixed typo in README.md (@psh0502)
- [#386](https://github.com/bda-research/node-crawler/pull/386) Circleci project setup (@mike442144)
- [#374](https://github.com/bda-research/node-crawler/pull/374) Unify formatting in README.md (@rauno56)

1.3.0
- [#367](https://github.com/bda-research/node-crawler/pull/367) add http2 functionality (@BeijingProtoHuman)
- [#364](https://github.com/bda-research/node-crawler/pull/364) Fix some typos (@pzmarzly)
- [#363](https://github.com/bda-research/node-crawler/pull/363) Remove stale vendored jQuery version (@pzmarzly)

1.2.2
- [#353](https://github.com/bda-research/node-crawler/pull/353) Release automate (@mike442144)
- [#338](https://github.com/bda-research/node-crawler/pull/338) #comment Adding support for Https socks5. Agent is imported directly … (@djpavlovic)
- [#336](https://github.com/bda-research/node-crawler/pull/336) Update README.md (@DanielHabenicht)
- [#329](https://github.com/bda-research/node-crawler/pull/329) add support for removeRefererHeader request option to preserve referer during redirects (@petskratt)
- [#314](https://github.com/bda-research/node-crawler/pull/314) docs: fix typo (@Jason-Cooke)

1.2.1
 * [#310](https://github.com/bda-research/node-crawler/issues/310) Upgrade dependencies' version(@mike442144)
 * [#303](https://github.com/bda-research/node-crawler/issues/303) Update seenreq to v3(@mike442144)
 * [#304](https://github.com/bda-research/node-crawler/pull/304) Replacement of istanbul with nyc (@kossidts)
 * [#300](https://github.com/bda-research/node-crawler/pull/300) Add formData arg to requestArgs (@humandevmode)
 * [#280](https://github.com/bda-research/node-crawler/pull/280) 20180611 updatetestwithnock (@Dong-Gao)

1.2.0
 * [#278](https://github.com/bda-research/node-crawler/pull/278) Added filestream require to download section (@swosko)
 * Use `nock` to mock testing instead of httpbin
 * Replace jshint by eslint
 * Fix code to pass eslint rules

1.1.4
 * Tolerate incorrect `Content-Type` header [#270](https://github.com/bda-research/node-crawler/pull/270), [#193](https://github.com/bda-research/node-crawler/issues/193)
 * Added examples [#272](https://github.com/bda-research/node-crawler/pull/272), [267](https://github.com/bda-research/node-crawler/issues/267)
 * Fixed "skipDuplicates" and "retries" config incompatible bug [#261](https://github.com/bda-research/node-crawler/issues/261)
 * Fix typo in README [#268](https://github.com/bda-research/node-crawler/pull/268)

1.1.3
 * Upgraded `request.js` and `lodash`

1.1.2
 * Recognize all XML MIME types to inject jQuery [#245](https://github.com/bda-research/node-crawler/pull/245)
 * Allow options to specify the Agent for Request [#246](https://github.com/bda-research/node-crawler/pull/246)
 * Added logo

1.1.1
 * added a way to replace the global options.headers keys by queuing options.headers  [#241](https://github.com/bda-research/node-crawler/issues/241)
 * fix bug of using last jar object if current options doesn't contain `jar` option [#240](https://github.com/bda-research/node-crawler/issues/240)
 * fix bug of encoding [#233](https://github.com/bda-research/node-crawler/issues/233)
 * added seenreq options [#208](https://github.com/bda-research/node-crawler/issues/208)
 * added preRequest, setLimiterProperty, direct request functions

1.0.5
 * fix missing debugging messages [#213](https://github.com/bda-research/node-crawler/issues/213)
 * fix bug of 'drain' never called [#210](https://github.com/bda-research/node-crawler/issues/210)

1.0.4
 * fix bug of charset detecting [#203](https://github.com/bda-research/node-crawler/issues/203)
 * keep node version up to date in travis scripts

1.0.3
 * fix bug, skipDuplicate and rotateUA don't work even if set true

1.0.0
 * upgrade jsdom up to 9.6.x
 * remove 0.10 and 0.12 support [#170](https://github.com/bda-research/node-crawler/issues/170)
 * control dependencies version using ^ and ~ [#169](https://github.com/bda-research/node-crawler/issues/169)
 * remove node-pool
 * notify bottleneck until a task is completed
 * replace bottleneck by bottleneckp, which has priority
 * change default log function
 * use event listener on `request` and `drain` instead of global function [#144](https://github.com/bda-research/node-crawler/issues/144)
 * default set forceUTF8 to true
 * detect `ESOCKETTIMEDOUT` instead of `ETIMEDOUT` when timeout in test
 * add `done` function in callback to avoid async trap
 * do not convert response body to string if `encoding` is null [#118](https://github.com/bda-research/node-crawler/issues/118)
 * add result document [#68](https://github.com/bda-research/node-crawler/issues/68) [#116](https://github.com/bda-research/node-crawler/issues/116)
 * add event `schedule` which is emitted when a task is being added to scheduler
 * in callback, move $ into `res` because of weird API
 * change rateLimits to rateLimit

0.7.5
 * delete entity in options before copy, and assgin after, `jar` is one of the typical properties which is an `Entity` wich functions [#177](https://github.com/bda-research/node-crawler/issues/177)
 * upgrade `request` to version 2.74.0

0.7.4
 * change `debug` option to instance level instead of `options`
 * update README.md to detail error handling
 * call `onDrain` with scope of `this`
 * upgrade `seenreq` version to 0.1.7

0.7.0
 * cancel recursion in queue
 * upgrade `request` version to v2.67.0

0.6.9
 * use `bottleneckConcurrent` instead of `maxConnections`, default `10000`
 * add debug info

0.6.5
 * fix a deep and big bug when initializing Pool, that may lead to sequence execution. [#2](https://github.com/bda-research/node-webcrawler/issues/2)
 * print log of Pool status

0.6.3
 * you could also get `result.options` from callback even when some errors ouccurred [#127](https://github.com/bda-research/node-crawler/issues/127) [#86](https://github.com/bda-research/node-crawler/issues/86)
 * add test for `bottleneck`

0.6.0
 * add `bottleneck` to implement rate limit, one can set limit for each connection at same time.

0.5.2
 * you can manually terminate all the resources in your pool, when `onDrain` called, before their timeouts have been reached
 * add a read-only property `queueSize` to crawler [#148](https://github.com/bda-research/node-crawler/issues/148) [#76](https://github.com/bda-research/node-crawler/issues/76) [#107](https://github.com/bda-research/node-crawler/issues/107)

0.5.1
 * remove cache feature, it's useless
 * add `localAddress`, `time`, `tunnel`, `proxyHeaderWhiteList`, `proxyHeaderExclusiveList` properties to pass to `request` [#155](https://github.com/bda-research/node-crawler/issues/155)

0.5.0
 * parse charset from `content-type` in http headers or meta tag in html, then convert
 * big5 charset is avaliable as the `iconv-lite` has already supported it 
 * default enable gzip in request header
 * remove unzip code in crawler since `request` will do this
 * body will return as a Buffer if encoding is null which is an option in `request`
 * remove cache and skip duplicate `request` for `GET`, `POST`(only for type `urlencode`), `HEAD`
 * add log feature, you can use `winston` to set `logger:winston`, or crawler will output to console
 * rotate user-agent in case some sites ban your requests

