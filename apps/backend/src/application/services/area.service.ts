import { IUnitOfWork } from "../../domain/interfaces/unit-of-work.interface";
import { Area } from "../../domain/entities/area.entity";

export class AreaService {
    constructor(private readonly unitOfWork: IUnitOfWork) { }

    async searchByName(name: string, cityId: number): Promise<Area[]> {
        return this.unitOfWork.areaRepository.searchByName(name, cityId);
    }

    async listByCityId(cityId: number): Promise<Area[]> {
        return this.unitOfWork.areaRepository.listByCityId(cityId);
    }
}
