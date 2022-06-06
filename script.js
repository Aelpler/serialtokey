const SerialPort = require('serialport')
const logger = require("@alpler/logger")

const { keyboard } = require('@nut-tree/nut-js');
keyboard.config.autoDelayMs = 0;
const port = new SerialPort('COM2')

// Open errors will be emitted as an error event
port.on('error', function (err) {
    console.log('Error: ', err.message)
})


// Switches the port into "flowing mode"
port.on('data', function (data) {
    if (!data || data.toString("utf8") == "undefined") {
        logger.log(logger.LogLevel.WARN, "onData", "Received Undefiened as data")
        return
    } else {
        logger.log(logger.LogLevel.INFO, "onData", "Received Valid Data")
    }
    console.log('Data:', data.toString("utf8"))
    keyboard.type(data.toString());
    logger.log(logger.LogLevel.INFO, "Received Data")
    logger.log(logger.LogLevel.INFO, data)
})

// Pipe the data into another stream (like a parser or standard out)Test

