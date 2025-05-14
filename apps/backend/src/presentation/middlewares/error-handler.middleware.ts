import { Request, Response, NextFunction } from "express";
import { NotFoundError } from "../../domain/errors/not-found.error";
import { ValidationError } from "../../domain/errors/validation.error";
import { LoggerFactory } from "../../config/logger.factory";

const logger = LoggerFactory.getLogger();

export const errorHandlerMiddleware = (err: Error, req: Request, res: Response, next: NextFunction) => {
    // Check if headers have already been sent
    if (res.headersSent) {
        return next(err);
    }

    // Determine the status code and message based on the error type
    let statusCode = 500;
    let message = 'Internal Server Error';
    let details = {};

    if (err instanceof NotFoundError) {
        statusCode = 404;
        message = err.message;
    } else if (err instanceof ValidationError) {
        statusCode = 400;
        message = 'Validation failed';
        details = { validationErrors: err.errors };
    }

    // Log the error with our logger
    logger.error(`Error processing ${req.method} ${req.url}`, err, {
        method: req.method,
        url: req.url,
        ip: req.ip,
        statusCode,
        ...details
    });

    // Send the response
    res.status(statusCode).json({
        error: {
            message,
            status: statusCode,
            ...details
        },
    });
};
