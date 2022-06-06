// Type definitions for @alpler/logger
// Project: https://github.com/Aelpler/-alpler-logger
// Author: https://github.com/Aelpler

import { LogLevel } from "../logLevel";


/**
 * Log messages into file and also into console
 * @param {LogLevel} logLevel Imporatance of you message
 * @param {string} location Where in the program a message came from 
 * @param {string} text The message you want to log
 * @public
 */
declare function log(logLevel: LogLevel, location: string, text: string): void

/**
 * Set log level at which it will log messages
 * @param {LogLevel} logLevel How important a message needs to be, to be loged
 * @public
 */
declare function setLogLevel(logLevel: LogLevel): void

/**
 * Create local files in which you log messages will end up.
 * Folder in which log.log and erros.log will be
 * @public
 */
declare function createFiles(): void

/**
 * Delete local files with log messages
 * In order to continue without messages don't forget to use createFiles() after
 * @public 
 */
declare function deleteFiles(): void

/**
 * Importance of a message
 * FATAL: Servere errors that might cause a crash
 * ERROR: Erros which may cause that the program will not be executed as intended
 * WARN:  Potential problems which could also just be nothing
 * INFO:  Information about the progress of the program
 * DEBUG: Detailed tracing messages for the progress of program
 * ALL:   All messages that did go through logging function
 * @return {number} Value of Log Level as number
 */

export { LogLevel } from "../logLevel"

export { deleteFiles, createFiles, log, setLogLevel }