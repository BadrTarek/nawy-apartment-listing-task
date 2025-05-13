import express, { Express } from "express";
import router from "./presentation/routes";
import dotenv from 'dotenv';

dotenv.config();

const app: Express = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Mount routes
app.use("/api", router);

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});