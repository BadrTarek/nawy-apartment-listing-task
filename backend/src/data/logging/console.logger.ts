import { ILogger } from '../../domain/interfaces/logger/logger.interface';

export class ConsoleLogger implements ILogger {
    private formatMessage(level: string, message: string, meta?: Record<string, any>): string {
        const timestamp = new Date().toISOString();
        const metaStr = meta ? `\n${JSON.stringify(meta, null, 2)}` : '';
        return `[${timestamp}] ${level}: ${message}${metaStr}`;
    }

    info(message: string, meta?: Record<string, any>): void {
        console.log(this.formatMessage('INFO', message, meta));
    }

    error(message: string, error?: Error, meta?: Record<string, any>): void {
        const errorMeta = {
            ...meta,
            error: error ? {
                message: error.message,
                stack: error.stack,
                name: error.name
            } : undefined
        };
        console.error(this.formatMessage('ERROR', message, errorMeta));
    }

    warn(message: string, meta?: Record<string, any>): void {
        console.warn(this.formatMessage('WARN', message, meta));
    }

    debug(message: string, meta?: Record<string, any>): void {
        console.debug(this.formatMessage('DEBUG', message, meta));
    }
}
