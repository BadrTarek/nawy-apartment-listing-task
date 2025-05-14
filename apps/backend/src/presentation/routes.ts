import { Router } from "express";
import { ApartmentsController } from "./controllers/apartments.controller";
import { UnitOfWork } from "../data/database/unit-of-work";
import { DataSource } from "typeorm";
import multer from "multer";
import { LocalMediaRepository } from "../data/media/local-media.repository";

const storage = multer.memoryStorage();
const upload = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    },
    fileFilter: (req, file, cb) => {
        // Accept only images
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed'));
        }
    }
});

export function createRouter(dataSource: DataSource): Router {
    const router = Router();

    // Initialize dependencies
    const unitOfWork = new UnitOfWork(dataSource);
    const mediaRepository = new LocalMediaRepository();
    const apartmentsController = new ApartmentsController(unitOfWork, mediaRepository);

    router.post(
        "/apartments",
        upload.array('images', 10), // Max 10 images
        apartmentsController.create.bind(apartmentsController)
    );

    return router;
}