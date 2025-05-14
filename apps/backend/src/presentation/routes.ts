import { Router } from "express";
import { ApartmentsController } from "./controllers/apartments.controller";
import { UnitOfWork } from "../data/database/unit-of-work";
import { DataSource } from "typeorm";

export function createRouter(dataSource: DataSource): Router {
    const router = Router();

    // Initialize dependencies
    const unitOfWork = new UnitOfWork(dataSource);
    const apartmentsController = new ApartmentsController(unitOfWork);

    // Define routes
    router.post("/apartments", apartmentsController.create.bind(apartmentsController));

    return router;
}