import { Request, Response } from "express";
import { IUnitOfWork } from "../../domain/interfaces/unit-of-work.interface";
import { AreaService } from "../../application/services/area.service";

export class AreasController {
    private readonly areaService: AreaService;

    constructor(private readonly unitOfWork: IUnitOfWork) {
        this.areaService = new AreaService(unitOfWork);
    }

    async search(req: Request, res: Response): Promise<void> {
        try {
            const { name, cityId } = req.query;
            if (typeof name !== 'string' || !cityId || isNaN(Number(cityId))) {
                res.status(400).json({
                    message: 'Name parameter is required and must be a string, cityId is required and must be a number'
                });
                return;
            }
            await this.unitOfWork.beginTransaction();
            const areas = await this.areaService.searchByName(name, Number(cityId));
            res.json(areas);
        } catch (error) {
            console.error('Error searching areas:', error);
            res.status(500).json({
                message: 'Error searching areas',
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        } finally {
            // Ensure transaction is committed or rolled back
            try {
                await this.unitOfWork.commit();
            } catch (error) {
                await this.unitOfWork.rollback();
                console.error("Transaction rollback due to error:", error);
            }
        }
    }

    async listByCity(req: Request, res: Response): Promise<void> {
        try {
            const { cityId } = req.params;
            if (!cityId || isNaN(Number(cityId))) {
                res.status(400).json({ message: 'City ID is required and must be a number' });
                return;
            }
            await this.unitOfWork.beginTransaction();
            const areas = await this.areaService.listByCityId(Number(cityId));
            res.json(areas);
        } catch (error) {
            console.error('Error listing areas:', error);
            res.status(500).json({
                message: 'Error listing areas',
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        } finally {
            // Ensure transaction is committed or rolled back
            try {
                await this.unitOfWork.commit();
            } catch (error) {
                await this.unitOfWork.rollback();
                console.error("Transaction rollback due to error:", error);
            }
        }
    }
}
