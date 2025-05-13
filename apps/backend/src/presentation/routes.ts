import { Router } from "express";
import { ApartmentsController } from "./controllers/apartments.controller";

const router = Router();

// Initialize dependencies
const apartmentsController = new ApartmentsController();

// Define routes
router.get("/apartments", apartmentsController.getAllApartments.bind(apartmentsController));

export default router;