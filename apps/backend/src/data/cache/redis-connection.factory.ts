import Redis, { RedisOptions } from 'ioredis';

export class RedisConnectionFactory {
    private static instance: Redis | null = null;

    static getConnection(options: RedisOptions = {}): Redis {
        RedisConnectionFactory.instance ??= new Redis({
            host: process.env.REDIS_HOST ?? 'localhost',
            port: parseInt(process.env.REDIS_PORT ?? '6379'),
            password: process.env.REDIS_PASSWORD,
            keyPrefix: process.env.REDIS_KEY_PREFIX ?? 'nawy:',
            ...options
        });
        return RedisConnectionFactory.instance;
    }
}
