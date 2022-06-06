"use strict";
/**
 * Index for @alpler/serialtokey
 * @author https://github.com/Aelpler
 * Project: https://github.com/Aelpler/-alpler-logger
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const logger_1 = require("@alpler/logger");
const serviceManager_1 = require("./serviceManager");
const config_1 = require("./config");
const SocketIOHandler_1 = require("./SocketIOHandler");
/**
 * Gets new instance of ServiceManager and executes its constructor
 * @date 7.5.2022 - 01:49:59
 * @type {ServiceManager}
 */
const serviceManager = serviceManager_1.getServiceManager();
/**
 * Generates new Files or logging imported from @alpler/logger
 * Sets Log Level to specified Log Level
 * @date 7.5.2022 - 01:51:42
 */
logger_1.createFiles();
logger_1.setLogLevel(logger_1.LogLevel.ALL);
/**
 * Creates a new instance of express
 * @date 7.5.2022 - 01:49:09
 * @type {express.Application}
 */
const app = express_1.default();
/**
 * Creates http Server and assigns the express instance to it
 * @date 7.5.2022 - 01:49:09
 * @type {http.Server}
 */
const httpServer = http_1.default.createServer(app);
/**
 * Creates a new SocketIO serverSocket and assigns it to the http server instance
 * @date 7.5.2022 - 01:49:09
 * @type {Server}
 */
SocketIOHandler_1.SocketIOHandler.setHttpServer(httpServer);
/**
 * Sets folder ./html as static resource for http server
 * @date 7.05.2022 - 01.58:53
 */
app.use(express_1.default.static("html"));
/**
 * Sets http server on specified port from .env and listens for connections
 * @date 7.05.2022 - 01:59:21
 */
httpServer.listen(config_1.config.port, function () {
    logger_1.log(logger_1.LogLevel.INFO, "app Listen", "Someone connected to client");
});
logger_1.log(logger_1.LogLevel.INFO, "index", "Server fully started ready for connection");
var opn = require('opn');
opn(`http://localhost:${config_1.config.port}`);
