/**
 * ServiceManager for @alpler/serialtokey
 * @author https://github.com/Aelpler
 * Project: https://github.com/Aelpler/-alpler-logger
 */

import { Service, EventLogger, User, list } from "node-windows"
import * as logger from "@alpler/logger"
import fs from "fs"
import { config, ServiceConfig } from "./config"
import { SocketIOHandler } from "./SocketIOHandler"


/**
 * Event Logger for node windows, outputs in daemon
 * @date 7.5.2022 - 01:37:14
 * @type {EventLogger} - EventLogger from node windows
 */
const eventLog: EventLogger = new EventLogger({
    source: 'node-windows'
})



/**
 * Class checking service checking, installing and uninstalling
 * @date 7.5.2022 - 01:37:14
 *
 * @class ServiceManager 
 * @typedef {ServiceManager}
 */
export class ServiceManager {

    serviceConfig: ServiceConfig
    /**
     * Instance of the currently used Service
     * @date 7.5.2022 - 01:37:14
     *
     * @type {Service}
     */
    service: Service
    /**
     * Status of current Service, see enum below
     * @date 7.5.2022 - 01:37:14
     *
     * @type {ServiceStatus}
     */
    serviceStatus: ServiceStatus = ServiceStatus.UNKNOWN

    /**
     * Creates an instance of ServiceManager.
     * @date 7.5.2022 - 01:37:14
     *
     * @constructor
     */
    constructor() {
        this.createService()

        if (config.getData().installed) {
            this.setServiceStatus(ServiceStatus.INSTALLED)
        } else {
            this.setServiceStatus(ServiceStatus.UNINSTALLED)
        }
    }

    createService() {
        this.service = new Service(
            {
                name: config.serviceName,
                description: config.serviceDescription,
                script: config.servicePath
            })

        this.registerEvents()
    }

    /**
     * Registers events to listen for from the service
     * @date 7.5.2022 - 01:37:14
     */
    registerEvents() {
        this.service.on("install", function () {
            eventLog.info("Service Installed")
            getServiceManager().setServiceStatus(ServiceStatus.INSTALLED)
            logger.log(logger.LogLevel.INFO, "InstallEvent", "Service Installed")
            getServiceManager().serviceStatus = ServiceStatus.INSTALLED
        })

        this.service.on("alreadyinstalled", function () {
            getServiceManager().setServiceStatus(ServiceStatus.INSTALLED)
            eventLog.info("Service already installed")
            logger.log(logger.LogLevel.INFO, "alreadyinstalled", "Service already Installed")
        })

        this.service.on("uninstall", function () {
            getServiceManager().setServiceStatus(ServiceStatus.UNINSTALLED)
            eventLog.info("Service uninstalled")
            logger.log(logger.LogLevel.INFO, "uninstall", "Service uninstalled")
        })

        this.service.on("alreadyuninstalled", function () {
            getServiceManager().setServiceStatus(ServiceStatus.UNINSTALLED)
            eventLog.info("Service already uninstalled")
            logger.log(logger.LogLevel.INFO, "alreadyuninstall", "Service already uninstalled")
        })

        this.service.on("start", function () {
            getServiceManager().setServiceStatus(ServiceStatus.INSTALLED)
            eventLog.info("Service started")
            logger.log(logger.LogLevel.INFO, "start", "Service started")
        })

        this.service.on("stop", function () {
            eventLog.info("Service stopped")
            logger.log(logger.LogLevel.INFO, "stop", "Service stopped")
        })

        this.service.on("invalidinstallation", function () {
            eventLog.error("Invalid Installation")
            logger.log(logger.LogLevel.ERROR, "uninstall", "Service invalid Installation")
        })

        this.service.on("error", function (error) {
            eventLog.error(`Error Encountered ${error}`)
            logger.log(logger.LogLevel.ERROR, "uninstall", `Service Encountered: ${error}`)
        })
    }

    install() {
        this.service.install()
    }

    uninstall() {
        this.service.uninstall()
    }

    setServiceStatus(serviceStatus: ServiceStatus) {
        this.serviceStatus = serviceStatus
        if (serviceStatus == ServiceStatus.INSTALLED)
            config.setInstalled(true)
        else
            config.setInstalled(false)
        SocketIOHandler.sendStatusUpdate()
    }
}

/**
 * Default values as service status, see servicestatus above
 * @date 7.5.2022 - 01:37:14
 *
 * @enum {3}
 */
enum ServiceStatus {
    UNKNOWN = "Unknown", INSTALLED = "Installed", UNINSTALLED = "Uninstalled"
}

/**
 * Instance of ServiceManager, so that just one instance can be started
 * @date 7.5.2022 - 01:37:14
 *
 * @type {ServiceManager}
 */
let instance: ServiceManager

/**
 * gives ServiceManager instance if none is existend it starts one
 * @date 7.5.2022 - 01:37:14
 *
 * @export
 * @returns {ServiceManager}
 */
export function getServiceManager(): ServiceManager {
    if (!instance)
        instance = new ServiceManager()
    return instance
}
