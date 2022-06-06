"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const envfile = __importStar(require("envfile"));
const fs_1 = __importDefault(require("fs"));
const sourcePath = "../.env";
let sourceObject = {};
/**
 * Loads port number from .env file and assigns it to port
 * @date 7.5.2022 - 01:49:09
 * @type {number}
 */
dotenv_1.default.config();
var config;
(function (config) {
    config.serviceName = process.env.name;
    config.serviceDescription = process.env.description;
    config.servicePath = process.env.scriptPath;
    config.port = Number.parseInt(process.env.port);
    const dataFile = "./data.json";
    function getData() {
        if (!fs_1.default.existsSync(dataFile)) {
            let defData = new ServiceDataDefault();
            fs_1.default.writeFileSync(dataFile, JSON.stringify(defData));
            return defData;
        }
        return JSON.parse(fs_1.default.readFileSync(dataFile).toString());
    }
    config.getData = getData;
    function setInstalled(installed) {
        let newData = getData();
        newData.installed = installed;
        fs_1.default.writeFileSync(dataFile, JSON.stringify(newData));
    }
    config.setInstalled = setInstalled;
    function saveConfig(serviceConfig) {
        config.serviceName = serviceConfig.name;
        config.serviceDescription = serviceConfig.description;
        config.servicePath = serviceConfig.scriptPath;
        config.port = serviceConfig.port;
        console.log("Saved");
        fs_1.default.writeFileSync("./.env", envfile.stringify(serviceConfig));
        console.log(envfile.stringify(serviceConfig));
    }
    config.saveConfig = saveConfig;
})(config = exports.config || (exports.config = {}));
class ServiceDataDefault {
    constructor() {
        this.installed = false;
    }
}
