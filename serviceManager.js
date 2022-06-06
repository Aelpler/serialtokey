"use strict";
/**
 * ServiceManager for @alpler/serialtokey
 * @author https://github.com/Aelpler
 * Project: https://github.com/Aelpler/-alpler-logger
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getServiceManager = exports.ServiceManager = void 0;
const node_windows_1 = require("node-windows");
const logger = __importStar(require("@alpler/logger"));
const config_1 = require("./config");
const SocketIOHandler_1 = require("./SocketIOHandler");
/**
 * Event Logger for node windows, outputs in daemon
 * @date 7.5.2022 - 01:37:14
 * @type {EventLogger} - EventLogger from node windows
 */
const eventLog = new node_windows_1.EventLogger({
    source: 'node-windows'
});
/**
 * Class checking service checking, installing and uninstalling
 * @date 7.5.2022 - 01:37:14
 *
 * @class ServiceManager
 * @typedef {ServiceManager}
 */
class ServiceManager {
    /**
     * Creates an instance of ServiceManager.
     * @date 7.5.2022 - 01:37:14
     *
     * @constructor
     */
    constructor() {
        /**
         * Status of current Service, see enum below
         * @date 7.5.2022 - 01:37:14
         *
         * @type {ServiceStatus}
         */
        this.serviceStatus = ServiceStatus.UNKNOWN;
        this.createService();
        if (config_1.config.getData().installed) {
            this.setServiceStatus(ServiceStatus.INSTALLED);
        }
        else {
            this.setServiceStatus(ServiceStatus.UNINSTALLED);
        }
    }
    createService() {
        this.service = new node_windows_1.Service({
            name: config_1.config.serviceName,
            description: config_1.config.serviceDescription,
            script: config_1.config.servicePath
        });
        this.registerEvents();
    }
    /**
     * Registers events to listen for from the service
     * @date 7.5.2022 - 01:37:14
     */
    registerEvents() {
        this.service.on("install", function () {
            eventLog.info("Service Installed");
            getServiceManager().setServiceStatus(ServiceStatus.INSTALLED);
            logger.log(logger.LogLevel.INFO, "InstallEvent", "Service Installed");
            getServiceManager().serviceStatus = ServiceStatus.INSTALLED;
        });
        this.service.on("alreadyinstalled", function () {
            getServiceManager().setServiceStatus(ServiceStatus.INSTALLED);
            eventLog.info("Service already installed");
            logger.log(logger.LogLevel.INFO, "alreadyinstalled", "Service already Installed");
        });
        this.service.on("uninstall", function () {
            getServiceManager().setServiceStatus(ServiceStatus.UNINSTALLED);
            eventLog.info("Service uninstalled");
            logger.log(logger.LogLevel.INFO, "uninstall", "Service uninstalled");
        });
        this.service.on("alreadyuninstalled", function () {
            getServiceManager().setServiceStatus(ServiceStatus.UNINSTALLED);
            eventLog.info("Service already uninstalled");
            logger.log(logger.LogLevel.INFO, "alreadyuninstall", "Service already uninstalled");
        });
        this.service.on("start", function () {
            getServiceManager().setServiceStatus(ServiceStatus.INSTALLED);
            eventLog.info("Service started");
            logger.log(logger.LogLevel.INFO, "start", "Service started");
        });
        this.service.on("stop", function () {
            eventLog.info("Service stopped");
            logger.log(logger.LogLevel.INFO, "stop", "Service stopped");
        });
        this.service.on("invalidinstallation", function () {
            eventLog.error("Invalid Installation");
            logger.log(logger.LogLevel.ERROR, "uninstall", "Service invalid Installation");
        });
        this.service.on("error", function (error) {
            eventLog.error(`Error Encountered ${error}`);
            logger.log(logger.LogLevel.ERROR, "uninstall", `Service Encountered: ${error}`);
        });
    }
    install() {
        this.service.install();
    }
    uninstall() {
        this.service.uninstall();
    }
    setServiceStatus(serviceStatus) {
        this.serviceStatus = serviceStatus;
        if (serviceStatus == ServiceStatus.INSTALLED)
            config_1.config.setInstalled(true);
        else
            config_1.config.setInstalled(false);
        SocketIOHandler_1.SocketIOHandler.sendStatusUpdate();
    }
}
exports.ServiceManager = ServiceManager;
/**
 * Default values as service status, see servicestatus above
 * @date 7.5.2022 - 01:37:14
 *
 * @enum {3}
 */
var ServiceStatus;
(function (ServiceStatus) {
    ServiceStatus["UNKNOWN"] = "Unknown";
    ServiceStatus["INSTALLED"] = "Installed";
    ServiceStatus["UNINSTALLED"] = "Uninstalled";
})(ServiceStatus || (ServiceStatus = {}));
/**
 * Instance of ServiceManager, so that just one instance can be started
 * @date 7.5.2022 - 01:37:14
 *
 * @type {ServiceManager}
 */
let instance;
/**
 * gives ServiceManager instance if none is existend it starts one
 * @date 7.5.2022 - 01:37:14
 *
 * @export
 * @returns {ServiceManager}
 */
function getServiceManager() {
    if (!instance)
        instance = new ServiceManager();
    return instance;
}
exports.getServiceManager = getServiceManager;
