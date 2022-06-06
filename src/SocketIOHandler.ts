import { Server, Socket } from "socket.io"
import { log, LogLevel, createFiles, setLogLevel } from "@alpler/logger"
import { config, ServiceConfig } from "./config"
import { getServiceManager, ServiceManager } from "./serviceManager"
import http from "http"

export namespace SocketIOHandler {

    let io: Server

    const sockets: Array<Socket> = new Array()

    const logArray: Array<String> = new Array()

    export function setHttpServer(httpServer: http.Server) {
        io = new Server(httpServer)
        registerEvents()
    }

    function registerEvents() {
        io.on("connection", (socket: Socket) => {
            sockets.push(socket)

            log(LogLevel.INFO, "index connection", "New socket connected to socketio " + socket.client.conn.remoteAddress)
            sendClientServiceConfig(socket)
            sendClientServiceStatus(socket)

            registerListeningChannels(socket)
        })
    }

    function registerListeningChannels(socket: Socket) {
        socket.on("serviceConfig", data => {
            let serviceConfig: ServiceConfig = JSON.parse(data)

            config.saveConfig(serviceConfig)
            getServiceManager().createService()
        })

        socket.on("reloadConfig", () => {
            sendClientServiceConfig(socket)
        })

        socket.on("installation", (data) => {
            let cmd = JSON.parse(data)
            console.log(data)
            if (cmd == 0) {
                getServiceManager().uninstall()
                console.log("Uninstalling")
            } else if (cmd == 1) {
                getServiceManager().install()
                console.log("installing")
            }

        })
    }

    function sendClientServiceConfig(socket: Socket) {
        let serviceConfig = {
            name: config.serviceName,
            description: config.serviceDescription,
            scriptPath: config.servicePath,
            port: config.port,
        }
        socket.emit("serviceConfig", JSON.stringify(serviceConfig))
    }

    function sendClientServiceStatus(socket: Socket) {
        socket.emit("serviceStatus", JSON.stringify(getServiceManager().serviceStatus))
    }

    export function sendStatusUpdate() {
        for (let socket of sockets) {
            sendClientServiceStatus(socket)
        }
    }

    export function logForClients(log: string) {
        console.log("Loggina")
        logArray.push(log)
        let sendObj = JSON.stringify({ message: log })
        for (let socket of sockets) {

            socket.emit("serviceLog", sendObj)
        }
    }
}