
import { Request, Response, NextFunction } from "express";
import { NotFoundError } from "../../domain/errors/not-found.error";
import { BadRequestError } from "../../domain/errors/bad-request.error";

export const errorHandlerMiddleware = (err: Error, req: Request, res: Response, next: NextFunction) => {
    // Determine the status code and message based on the error type
    let statusCode = 500;
    let message = 'Internal Server Error';

    if (err instanceof NotFoundError) {
        statusCode = 404;
        message = err.message;
    } else if (err instanceof BadRequestError) {
        statusCode = 400;
        message = err.message;
    }
    // Log the error
    console.error({
        message: err.message,
        stack: err.stack,
        method: req.method,
        url: req.url,
        ip: req.ip,
    });

    // Send the response
    res.status(statusCode).json({
        error: {
            message,
            status: statusCode,
        },
    });
};
