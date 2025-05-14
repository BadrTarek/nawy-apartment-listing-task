import { Area } from "../../entities/area.entity";

export interface IAreaRepository {
    searchByName(name: string, cityId: number): Promise<Area[]>;
    listByCityId(cityId: number): Promise<Area[]>;
}
