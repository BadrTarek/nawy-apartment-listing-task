import { ILogger } from '../domain/interfaces/logger/logger.interface';
import { ConsoleLogger } from '../data/logging/console.logger';

export type LoggerType = 'console';

export class LoggerFactory {
    private static instance: ILogger;

    static getLogger(type: LoggerType = 'console'): ILogger {
        if (!LoggerFactory.instance) {
            LoggerFactory.instance = new ConsoleLogger();
        }
        return LoggerFactory.instance;
    }
}
