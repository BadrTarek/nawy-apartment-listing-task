import 'reflect-metadata';
import express, { Express } from "express";
import path from "path";
import { createRouter } from "./presentation/routes";
import { errorHandlerMiddleware } from './presentation/middlewares/error-handler.middleware';
import { requestLoggerMiddleware } from './presentation/middlewares/request-logger.middleware';
import cors from 'cors';
import { DependencyContainer } from './config/container';



async function bootstrap() {
    // Initialize DI container
    DependencyContainer.configure();

    const app: Express = express();
    const port = process.env.PORT ?? 3000;

    // Middleware to parse JSON bodies
    app.use(express.json());
    app.use(cors());

    // Request logger middleware
    app.use(requestLoggerMiddleware);

    // Serve static files from uploads directory
    app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

    // Mount routes
    app.use("/api", createRouter());

    // Error-handling middleware (must be after all routes)
    app.use(errorHandlerMiddleware);

    // Start the server
    app.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`);
    });
}

bootstrap().catch(error => {
    console.error("Failed to start the application:", error);
    process.exit(1);
});