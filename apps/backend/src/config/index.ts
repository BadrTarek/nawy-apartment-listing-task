import "reflect-metadata";
import { DataSource } from "typeorm";
import * as models from "../data/database/models";
import dotenv from 'dotenv';
import Redis from 'ioredis';


dotenv.config();


export const databaseDataSource = new DataSource({
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

export const redisConnection = new Redis({
    host: process.env.REDIS_HOST ?? 'localhost',
    port: parseInt(process.env.REDIS_PORT ?? '6379'),
    password: process.env.REDIS_PASSWORD,
    keyPrefix: process.env.REDIS_KEY_PREFIX ?? 'nawy:',
    lazyConnect: true,
    retryStrategy: (times) => {
        // Exponential backoff strategy
        return Math.min(times * 50, 2000);
    }
});

export const uploadImageSettings = {
    url: process.env.SERVER_URL ?? 'http://localhost:3000',
    path: process.env.SERVER_UPLOADS_PATH ?? 'uploads'
}