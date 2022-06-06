import * as logger from "@alpler/logger"

logger.setLogLevel(logger.LogLevel.INFO)
logger.log(logger.LogLevel.ERROR, "example.ts:3", "There is no code left to execute :(") 
