import { Logger } from "tslog"

const log = new Logger({
    type: "pretty",
    name: "Crawler",
    hideLogPositionForProduction: true,
    prettyLogTemplate: "{{name}} {{logLevelName}} ",
    prettyLogStyles: {
        logLevelName: {
            SILLY: ["bold", "white"],
            TRACE: ["bold", "whiteBright"],
            DEBUG: ["bold", "green"],
            INFO: ["bold", "blue"],
            WARN: ["bold", "yellow"],
            ERROR: ["bold", "red"],
            FATAL: ["bold", "redBright"],
        },
        name: ["bold", "blue"],
        dateIsoStr: "white",
        filePathWithLine: "white",
        nameWithDelimiterPrefix: ["white", "bold"],
        nameWithDelimiterSuffix: ["white", "bold"],
        errorName: ["bold", "bgRedBright", "whiteBright"],
        fileName: ["yellow"],
    },
});

log.silly("I am a silly log.");
log.trace("I am a trace log.");
log.debug("I am a debug log.");
log.info("I am an info log.");
log.warn("I am a warn log with a json object:", { foo: "bar" });
log.error("I am an error log.");
log.fatal(new Error("I am a pretty Error with a stacktrace."));