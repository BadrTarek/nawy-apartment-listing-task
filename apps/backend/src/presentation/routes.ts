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

    // Initialize controllers
    const apartmentsController = new ApartmentsController(dataSource);
    const countriesController = new CountriesController(dataSource);
    const citiesController = new CitiesController(dataSource);
    const areasController = new AreasController(dataSource);

    // Apartments routes
    router.post(
        "/apartments",
        upload.array('images', 10), // Max 10 images
        apartmentsController.create.bind(apartmentsController)
    );
    router.get(
        "/apartments",
        apartmentsController.filter.bind(apartmentsController)
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