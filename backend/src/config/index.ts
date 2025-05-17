import "reflect-metadata";
import { DataSource } from "typeorm";
import * as models from "../data/database/models";
import dotenv from 'dotenv';
import Redis from 'ioredis';
import { z } from 'zod';


dotenv.config();

// Define the environment variables schema
const envSchema = z.object({
    DB_HOST: z.string(),
    DB_PORT: z.string().transform(val => Number(val)).refine(val => !isNaN(val) && val > 0, {
        message: 'PORT must be a positive number',
    }),
    DB_USERNAME: z.string(),
    DB_PASSWORD: z.string(),
    DB_NAME: z.string(),
    REDIS_HOST: z.string(),
    REDIS_PORT: z.string().transform(val => Number(val)).refine(val => !isNaN(val) && val > 0, {
        message: 'PORT must be a positive number',
    }),
    REDIS_PASSWORD: z.string(),
    REDIS_KEY_PREFIX: z.string(),
    SERVER_URL: z.string(),
    SERVER_UPLOADS_PATH: z.string(),
    SERVER_PORT: z.string().transform(val => Number(val)).refine(val => !isNaN(val) && val > 0, {
        message: 'PORT must be a positive number',
    }),
    NODE_ENV: z.enum(['development', 'production', 'test'], {
        errorMap: () => ({ message: "NODE_ENV must be one of 'development', 'production', or 'test'" }),
    }),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
    console.error('Invalid environment variables:', _env.error.format());
    process.exit(1);
}


export const createDatabaseDataSourceFactory = () => new DataSource({
    type: "postgres",
    host: _env.data.DB_HOST,
    port: parseInt(_env.data.DB_PORT.toString()),
    username: _env.data.DB_USERNAME,
    password: _env.data.DB_PASSWORD,
    database: _env.data.DB_NAME,
    synchronize: false,
    logging: true,
    entities: Object.values(models),
    migrations: ["src/data/database/migrations/*.ts"],
    subscribers: []
});

export const redisConnection = new Redis({
    host: _env.data.REDIS_HOST,
    port: _env.data.REDIS_PORT,
    password: _env.data.REDIS_PASSWORD,
    keyPrefix: _env.data.REDIS_KEY_PREFIX,
    lazyConnect: true,
    retryStrategy: (times) => {
        // Exponential backoff strategy
        return Math.min(times * 50, 2000);
    }
});

export const uploadImageSettings = {
    url: _env.data.SERVER_URL,
    path: _env.data.SERVER_UPLOADS_PATH,
}

export const serverPort = _env.data.SERVER_PORT;