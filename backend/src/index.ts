import 'reflect-metadata';
import express, { Express } from "express";
import path from "path";
import { createRouter } from "./presentation/routes";
import { createErrorHandlerMiddleware } from './presentation/middlewares/error-handler.middleware';
import { createRequestLoggerMiddleware } from './presentation/middlewares/request-logger.middleware';
import cors from 'cors';
import { DependencyContainer } from './config/container';
import { serverPort } from './config';
import { container } from 'tsyringe';
import { ILogger } from './domain/interfaces/logger/logger.interface';



async function bootstrap() {
    // Initialize DI container
    DependencyContainer.configure();

    const app: Express = express();
    const logger = container.resolve<ILogger>("ILogger");

    // Middleware to parse JSON bodies
    app.use(express.json());
    app.use(cors());

    // Request logger middleware
    app.use(createRequestLoggerMiddleware(logger));

    // Serve static files from uploads directory
    app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

    // Mount routes
    app.use("/api", createRouter());

    // Error-handling middleware (must be after all routes)
    app.use(createErrorHandlerMiddleware(logger));

    // Start the server
    app.listen(serverPort, () => {
        console.log(`Server is running on http://localhost:${serverPort}`);
    });
}

bootstrap().catch(error => {
    console.error("Failed to start the application:", error);
    process.exit(1);
});