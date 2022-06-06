"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketIOHandler = void 0;
const socket_io_1 = require("socket.io");
const logger_1 = require("@alpler/logger");
const config_1 = require("./config");
const serviceManager_1 = require("./serviceManager");
var SocketIOHandler;
(function (SocketIOHandler) {
    let io;
    const sockets = new Array();
    const logArray = new Array();
    function setHttpServer(httpServer) {
        io = new socket_io_1.Server(httpServer);
        registerEvents();
    }
    SocketIOHandler.setHttpServer = setHttpServer;
    function registerEvents() {
        io.on("connection", (socket) => {
            sockets.push(socket);
            logger_1.log(logger_1.LogLevel.INFO, "index connection", "New socket connected to socketio " + socket.client.conn.remoteAddress);
            sendClientServiceConfig(socket);
            sendClientServiceStatus(socket);
            registerListeningChannels(socket);
        });
    }
    function registerListeningChannels(socket) {
        socket.on("serviceConfig", data => {
            let serviceConfig = JSON.parse(data);
            config_1.config.saveConfig(serviceConfig);
            serviceManager_1.getServiceManager().createService();
        });
        socket.on("reloadConfig", () => {
            sendClientServiceConfig(socket);
        });
        socket.on("installation", (data) => {
            let cmd = JSON.parse(data);
            console.log(data);
            if (cmd == 0) {
                serviceManager_1.getServiceManager().uninstall();
                console.log("Uninstalling");
            }
            else if (cmd == 1) {
                serviceManager_1.getServiceManager().install();
                console.log("installing");
            }
        });
    }
    function sendClientServiceConfig(socket) {
        let serviceConfig = {
            name: config_1.config.serviceName,
            description: config_1.config.serviceDescription,
            scriptPath: config_1.config.servicePath,
            port: config_1.config.port,
        };
        socket.emit("serviceConfig", JSON.stringify(serviceConfig));
    }
    function sendClientServiceStatus(socket) {
        socket.emit("serviceStatus", JSON.stringify(serviceManager_1.getServiceManager().serviceStatus));
    }
    function sendStatusUpdate() {
        for (let socket of sockets) {
            sendClientServiceStatus(socket);
        }
    }
    SocketIOHandler.sendStatusUpdate = sendStatusUpdate;
    function logForClients(log) {
        console.log("Loggina");
        logArray.push(log);
        let sendObj = JSON.stringify({ message: log });
        for (let socket of sockets) {
            socket.emit("serviceLog", sendObj);
        }
    }
    SocketIOHandler.logForClients = logForClients;
})(SocketIOHandler = exports.SocketIOHandler || (exports.SocketIOHandler = {}));
