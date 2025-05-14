import { Router } from "express";
import { ApartmentsController } from "./controllers/apartments.controller";
import { CountriesController } from "./controllers/countries.controller";
import { CitiesController } from "./controllers/cities.controller";
import { AreasController } from "./controllers/areas.controller";
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

    // Initialize controllers
    const apartmentsController = new ApartmentsController(unitOfWork, mediaRepository);
    const countriesController = new CountriesController(unitOfWork);
    const citiesController = new CitiesController(unitOfWork);
    const areasController = new AreasController(unitOfWork);

    // Apartments routes
    router.post(
        "/apartments",
        upload.array('images', 10), // Max 10 images
        apartmentsController.create.bind(apartmentsController)
    );

    // Countries routes
    router.get("/countries/search", countriesController.search.bind(countriesController));
    router.get("/countries", countriesController.list.bind(countriesController));

    // Cities routes
    router.get("/cities/search", citiesController.search.bind(citiesController));
    router.get("/countries/:countryId/cities", citiesController.listByCountry.bind(citiesController));

    // Areas routes
    router.get("/areas/search", areasController.search.bind(areasController));
    router.get("/cities/:cityId/areas", areasController.listByCity.bind(areasController));

    return router;
}