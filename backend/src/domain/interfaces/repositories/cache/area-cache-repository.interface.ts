import { Area } from "../../../entities/area.entity";
import { IBaseCacheRepository } from "./base-cache-repository.interface";

export interface IAreaCacheRepository extends IBaseCacheRepository<Area[]> {
    getAreasByCity(cityId: number): Promise<Area[] | null>;
    setAreasByCity(cityId: number, areas: Area[]): Promise<void>;
    getAreasByNameAndCity(name: string, cityId: number): Promise<Area[] | null>;
    setAreasByNameAndCity(name: string, cityId: number, areas: Area[]): Promise<void>;
}
