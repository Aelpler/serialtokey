/**
 * Index for @alpler/serialtokey
 * @author https://github.com/Aelpler
 * Project: https://github.com/Aelpler/-alpler-logger
 */

import express from "express"
import http from "http"
import { log, LogLevel, createFiles, setLogLevel } from "@alpler/logger"
import { getServiceManager, ServiceManager } from "./serviceManager"
import { config } from "./config"
import { SocketIOHandler } from "./SocketIOHandler"



/**
 * Gets new instance of ServiceManager and executes its constructor
 * @date 7.5.2022 - 01:49:59
 * @type {ServiceManager}
 */
const serviceManager: ServiceManager = getServiceManager()



/**
 * Generates new Files or logging imported from @alpler/logger
 * Sets Log Level to specified Log Level
 * @date 7.5.2022 - 01:51:42
 */
createFiles()
setLogLevel(LogLevel.ALL)

/**
 * Creates a new instance of express
 * @date 7.5.2022 - 01:49:09
 * @type {express.Application}
 */
const app: express.Application = express()

/**
 * Creates http Server and assigns the express instance to it
 * @date 7.5.2022 - 01:49:09
 * @type {http.Server}
 */
const httpServer: http.Server = http.createServer(app)
/**
 * Creates a new SocketIO serverSocket and assigns it to the http server instance
 * @date 7.5.2022 - 01:49:09
 * @type {Server}
 */

SocketIOHandler.setHttpServer(httpServer)

/**
 * Sets folder ./html as static resource for http server
 * @date 7.05.2022 - 01.58:53
 */
app.use(express.static("html"))
/**
 * Sets http server on specified port from .env and listens for connections
 * @date 7.05.2022 - 01:59:21
 */
httpServer.listen(config.port, function () {
    log(LogLevel.INFO, "app Listen", "Someone connected to client")
})

log(LogLevel.INFO, "index", "Server fully started ready for connection")

var opn = require('opn');
opn(`http://localhost:${config.port}`);