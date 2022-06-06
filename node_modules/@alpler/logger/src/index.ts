// Type definitions for @alpler/logger
// Project: https://github.com/Aelpler/-alpler-logger
// Author: https://github.com/Aelpler

import fs from "fs"
import path from "path"
import { LogLevel } from "./logLevel"


/**
 * Level at which a message will be logged
 * default: LogLevel.INFO
 */
let _logLevel: LogLevel = LogLevel.INFO

/**
 * Folder in which logs will be saved
 */
let _logFolder = "logs"
/**
 * File where all messages will end up
 */
let _log_File = "log.log"
/**
 * File where messages with level greater than LogLevel.WARN will end up
 */
let _log_Error_File = "errors.log"

/**
 * Set log level at which it will log messages
 * @param {LogLevel} logLevel How important a message needs to be, to be loged
 * @public
 */
export function setLogLevel(logLevel: LogLevel): void {
    _logLevel = logLevel
}

/**
 * Create local files in which you log messages will end up.
 * Folder in which log.log and erros.log will be
 * @public
 */
export function createFiles(): void {
    if (!fs.existsSync(path.join("./", _logFolder)))
        fs.mkdirSync(path.join("./", _logFolder))

    if (!fs.existsSync(path.join("./", _logFolder, _log_File)))
        fs.writeFileSync(path.join("./", _logFolder, _log_File), "")
    if (!fs.existsSync(path.join("./", _logFolder, _log_Error_File)))
        fs.writeFileSync(path.join("./", _logFolder, _log_Error_File), "")
}

/**
 * Delete local files with log messages
 * In order to continue without messages don't forget to use createFiles() after
 * @public 
 */
export function deleteFiles(): void {
    if (fs.existsSync(path.join("./", _logFolder)))
        fs.rmSync(path.join("./", _logFolder), { recursive: true, force: true })
}

/**
 * Log messages into file and also into console
 * @param {LogLevel} logLevel Imporatance of you message
 * @param {string} location Where in the program a message came from 
 * @param {string} text The message you want to log
 * @public
 */
export function log(logLevel: LogLevel, location: string, text: string): void {
    let formatedLog: string = formatText(logLevel, location, text)

    // If logLevel is greater than error write also to error.log
    if (logLevel >= 3000) {
        fs.appendFile(path.join("./", _logFolder, _log_Error_File), formatedLog, function (err: any) {
            if (err)
                console.log(`Couldn't write to error log ${err}`)
        })
    }

    // Logs if logLevel from message is greater or simular to set _logLevel
    if (_logLevel <= logLevel) {
        fs.appendFile(path.join("./", _logFolder, _log_File), formatedLog, function (err: any) {
            if (err)
                console.log(`Couldn't write to log file ${err}`)
        })
    }

    if (logLevel >= 3000 || _logLevel <= logLevel) {
        console.log(formatedLog)
    }
}

/**
 * Formats the given parameters into single text so all have the same format
 * @param {LogLevel} logLevel Imporatance of you message
 * @param {string} location Where in the program a message came from 
 * @param {string} text The message you want to log
 * @return {string} Formated log message with date,time,level,location,text
 */
function formatText(logLevel: LogLevel, location: string, text: string): string {
    let date = new Date()
    let dateString = `[${formatNumber(date.getDate())}.${formatNumber(date.getMonth())}.${date.getFullYear()}]`
    let timeString = `[${formatNumber(date.getHours())}:${formatNumber(date.getMinutes())}]`
    return `${dateString} ${timeString} ${LogLevel[logLevel]} ${location} ${text}\n`
}

/**
 * Converts a number to string, adds n is below value of 10
 * @param {number} n Number which will be converted to string
 * @return {string} Formated number, with may added 0 
 */
function formatNumber(n: number): string {
    return (n < 10 ? '0' : '') + n;
}

export { LogLevel }
