import "reflect-metadata";
import { container } from 'tsyringe';
import { createDatabaseDataSourceFactory, redisConnection, uploadImageSettings } from ".";

// Importing the concrete implementations
import { AreaRedisCache } from '../data/cache/area-redis.cache';
import { CityRedisCache } from '../data/cache/city-redis.cache';
import { CountryRedisCache } from '../data/cache/country-redis.cache';
import { LocalMediaRepository } from '../data/media/local-media.repository';
import { UnitOfWork } from '../data/database/unit-of-work';
import { ConsoleLogger } from "../data/logging/console.logger";

// Importing the interfaces
import { IUnitOfWork } from '../domain/interfaces/unit-of-work.interface';
import { IAreaCacheRepository } from '../domain/interfaces/repositories/cache/area-cache-repository.interface';
import { IMediaRepository } from '../domain/interfaces/repositories/media-repository.interface';
import { ICountryCacheRepository } from '../domain/interfaces/repositories/cache/country-cache-repository.interface';
import { ICityCacheRepository } from '../domain/interfaces/repositories/cache/city-cache-repository.interface';
import { ILogger } from '../domain/interfaces/logger/logger.interface';




export class DependencyContainer {
    public static configure(): void {

        // Register the logger as a singleton (same instance throughout the app)
        container.registerSingleton<ILogger>("ILogger", ConsoleLogger);

        // Register UnitOfWork as transient (new instance each time)
        container.register<IUnitOfWork>("IUnitOfWork", {
            useFactory: () => {
                const unitOfWork = new UnitOfWork(createDatabaseDataSourceFactory());
                return unitOfWork;
            }
        });

        // Register cache repositories as transient (new instance each time)
        container.register<ICityCacheRepository>("ICityCacheRepository", {
            useFactory: () => {
                const cityCache = new CityRedisCache(redisConnection);
                return cityCache;
            }
        });
        container.register<ICountryCacheRepository>("ICountryCacheRepository", {
            useFactory: () => {
                const countryCache = new CountryRedisCache(redisConnection);
                return countryCache;
            }
        });
        container.register<IAreaCacheRepository>("IAreaCacheRepository", {
            useFactory: () => {
                const areaCache = new AreaRedisCache(redisConnection);
                return areaCache;
            }
        });

        // Register media repository as transient (new instance each time)
        container.register<IMediaRepository>("IMediaRepository", {
            useFactory: () => {
                const mediaRepository = new LocalMediaRepository(
                    uploadImageSettings.path,
                    uploadImageSettings.url
                );
                return mediaRepository;
            }
        });
    }

    public static getContainer() {
        return container;
    }
}
