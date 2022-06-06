# @alpler/logger

## Table of Contents
- [Install](#install)
- [Introduction](#introduction)
- [Log Levels](#log-levels)

## Install
This is a NodeJs Module, it can be installed through the npm registry.

To install use the following command in your root directory.

    $ npm install @alpler/logger

## Introduction
This is a simple logger for NodeJs. It will generate to log Files in which messages can be logged. 
	errors.log	Will only include messages with a level higher than WARN 
	log.log         Will include all messages above the before set Log Level

Simple example of how use it

JavaScript:

    const logger = require("@alpler/logger");
    logger.setLogLevel(logger.LogLevel.INFO);
    logger.log(logger.LogLevel.ERROR, "example.js:5", "There is no code left to execute :(");


TypeScript: 

    import * as logger from "@alpler/logger"
    
    logger.setLogLevel(logger.LogLevel.INFO)
    logger.log(logger.LogLevel.ERROR, "example.ts:3", "There is no code left to execute :( ") 

	
	
OUTPUT:

    [21.02.2022] [01:08] ERROR example.ts:3 There is no code left to execute :(


## Log Levels
Each Log Level describes the different importance of a message. 

### Types:

In the version 1.2.1 there are six different Log levels these are


Name | Value | Description
---------|----------|---------
 FATAL | 5000 | Servere errors that might cause a crash
 ERROR | 4000 | Erros which may prevent normal execution of the program
 WARN | 3000 | Potential problems which could also just be nothing
 INFO | 2000 | Information about the progress of the program
 DEBUG | 1000 | Detailed tracing messages for the progress of the program
 ALL | 0 | All that could you ever want to log



### Usages:

#### **Setting the Log Level**

Typescript:

    logger.setLogLevel(logger.LogLevel.INFO)

JavaScript:

    logger.setLogLevel(logger.LogLevel.INFO)
   
   This will set the Level at which the logger will start writing it into the log.log and also the console

#### **Logging a message**

Typescript:

    logger.log(logger.LogLevel.ERROR, "example.ts:3", "There is no code left to execute :(")

JavaScript:

    logger.log(logger.LogLevel.ERROR, "example.js:5", "There is no code left to execute :(")

In this Case we pass a Log Level with a message so the logger can check if the message should be logged.

