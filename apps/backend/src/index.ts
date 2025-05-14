import 'reflect-metadata';
import express, { Express } from "express";
import { createRouter } from "./presentation/routes";
import { nawyApartmentDataSource } from "./config";




async function bootstrap() {
    // Initialize TypeORM connection
    await nawyApartmentDataSource.initialize();
    console.log("Database connection initialized");

    const app: Express = express();
    const port = process.env.PORT ?? 3000;

    // Middleware to parse JSON bodies
    app.use(express.json());

    // Mount routes
    app.use("/api", createRouter(nawyApartmentDataSource));


    // Start the server
    app.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`);
    });
}

bootstrap().catch(error => {
    console.error("Failed to start the application:", error);
    process.exit(1);
});