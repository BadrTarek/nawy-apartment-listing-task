import Redis from 'ioredis';
import { IBaseCacheRepository } from '../../domain/interfaces/repositories/cache/base-cache-repository.interface';

export abstract class BaseRedisCache<T> implements IBaseCacheRepository<T> {
    protected constructor(
        protected readonly redis: Redis,
        protected readonly prefix: string,
        protected readonly defaultTtlSeconds: number = 3600 // 1 hour default TTL
    ) { }

    protected getKey(key: string): string {
        return `${this.prefix}:${key}`;
    }

    async get(key: string): Promise<T | null> {
        const data = await this.redis.get(this.getKey(key));
        if (!data) return null;
        return JSON.parse(data) as T;
    }

    async set(key: string, value: T, ttlSeconds: number = this.defaultTtlSeconds): Promise<void> {
        const fullKey = this.getKey(key);
        await this.redis.setex(fullKey, ttlSeconds, JSON.stringify(value));
    }

    async delete(key: string): Promise<void> {
        await this.redis.del(this.getKey(key));
    }
}
