"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogLevel = void 0;
var LogLevel;
(function (LogLevel) {
    /** Servere errors that might cause a crash */
    LogLevel[LogLevel["FATAL"] = 5000] = "FATAL";
    /** Erros which may cause that the program will not be executed as intended */
    LogLevel[LogLevel["ERROR"] = 4000] = "ERROR";
    /** Potential problems which could also just be nothing */
    LogLevel[LogLevel["WARN"] = 3000] = "WARN";
    /** Information about the progress of the program */
    LogLevel[LogLevel["INFO"] = 2000] = "INFO";
    /** Detailed tracing messages for the progress of program */
    LogLevel[LogLevel["DEBUG"] = 1000] = "DEBUG";
    /** All messages that did go through logging function */
    LogLevel[LogLevel["ALL"] = 0] = "ALL";
})(LogLevel || (LogLevel = {}));
exports.LogLevel = LogLevel;
