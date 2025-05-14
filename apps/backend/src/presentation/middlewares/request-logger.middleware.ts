import { Request, Response, NextFunction } from 'express';
import { LoggerFactory } from '../../config/logger.factory';

const logger = LoggerFactory.getLogger();

export const requestLoggerMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const startTime = Date.now();

    // Log the incoming request
    const requestLog = {
        method: req.method,
        url: req.originalUrl,
        query: req.query,
        body: req.body,
        headers: req.headers,
        ip: req.ip,
    };

    logger.info(`Incoming ${req.method} ${req.originalUrl}`, requestLog);

    // Using both finish and close events to ensure we catch all scenarios
    let logSent = false;

    const logResponse = () => {
        if (logSent) return;
        logSent = true;

        const duration = Date.now() - startTime;
        const responseLog = {
            duration: `${duration}ms`,
            statusCode: res.statusCode,
            statusMessage: res.statusMessage,
            headers: res.getHeaders(),
        };

        if (res.statusCode >= 400) {
            logger.error(`Failed ${req.method} ${req.originalUrl}`, undefined, responseLog);
        } else {
            logger.info(`Completed ${req.method} ${req.originalUrl}`, responseLog);
        }
    };

    res.on('finish', logResponse);
    res.on('close', logResponse);

    next();
};
