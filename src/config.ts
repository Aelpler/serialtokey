import dotenv from "dotenv";
import * as envfile from "envfile"
import fs from "fs"

const sourcePath = "../.env"
let sourceObject = {};
/**
 * Loads port number from .env file and assigns it to port
 * @date 7.5.2022 - 01:49:09
 * @type {number}
 */
dotenv.config()

export namespace config {

    export let serviceName = process.env.name
    export let serviceDescription = process.env.description
    export let servicePath = process.env.scriptPath
    export let port: number = Number.parseInt(process.env.port)

    const dataFile: string = "./data.json"

    export function getData(): ServiceData {
        if (!fs.existsSync(dataFile)) {
            let defData = new ServiceDataDefault()
            fs.writeFileSync(dataFile, JSON.stringify(defData))
            return defData
        }

        return JSON.parse(fs.readFileSync(dataFile).toString())
    }

    export function setInstalled(installed: boolean) {
        let newData = getData()
        newData.installed = installed
        fs.writeFileSync(dataFile, JSON.stringify(newData))
    }

    export function saveConfig(serviceConfig: ServiceConfig) {
        serviceName = serviceConfig.name
        serviceDescription = serviceConfig.description
        servicePath = serviceConfig.scriptPath
        port = serviceConfig.port

        console.log("Saved")
        fs.writeFileSync("./.env", envfile.stringify(serviceConfig))
        console.log(envfile.stringify(serviceConfig))
    }
}

export interface ServiceConfig {

    name: string
    description: string
    scriptPath: string
    port: number

}

interface ServiceData {
    installed: boolean
}


class ServiceDataDefault implements ServiceData {

    installed: boolean = false;

}