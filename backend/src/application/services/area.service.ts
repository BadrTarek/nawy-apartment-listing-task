import { IUnitOfWork } from "../../domain/interfaces/unit-of-work.interface";
import { Area } from "../../domain/entities/area.entity";
import { IAreaCacheRepository } from "../../domain/interfaces/repositories/cache/area-cache-repository.interface";

export class AreaService {

    constructor(
        private readonly unitOfWork: IUnitOfWork,
        private readonly cacheRepository: IAreaCacheRepository
    ) { }

    async searchByName(name: string, cityId: number): Promise<Area[]> {
        // Try to get from cache first
        const cachedAreas = await this.cacheRepository.getAreasByNameAndCity(name, cityId);
        if (cachedAreas) {
            return cachedAreas;
        }

        // If not in cache, get from database
        const areas = await this.unitOfWork.areaRepository.searchByName(name, cityId);

        // Store in cache for future requests
        await this.cacheRepository.setAreasByNameAndCity(name, cityId, areas);

        return areas;
    }

    async listByCityId(cityId: number): Promise<Area[]> {
        // Try to get from cache first
        const cachedAreas = await this.cacheRepository.getAreasByCity(cityId);
        if (cachedAreas) {
            return cachedAreas;
        }

        // If not in cache, get from database
        const areas = await this.unitOfWork.areaRepository.listByCityId(cityId);

        // Store in cache for future requests
        await this.cacheRepository.setAreasByCity(cityId, areas);

        return areas;
    }
}
