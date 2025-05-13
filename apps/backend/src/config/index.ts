import "reflect-metadata";
import { DataSource } from "typeorm";
import * as models from "../data/database/models";
import dotenv from 'dotenv';

dotenv.config();


export const NawyApartmentDataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST ?? "localhost",
    port: parseInt(process.env.DB_PORT ?? "5432"),
    username: process.env.DB_USERNAME ?? "YOUR_USERNAME",
    password: process.env.DB_PASSWORD ?? "YOUR_PASSWORD",
    database: process.env.DB_NAME ?? "YOUR_DATABASE",
    synchronize: false,
    logging: true,
    entities: Object.values(models),
    migrations: ["src/data/database/migrations/*.ts"],
    subscribers: []
});





