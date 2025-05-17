import { Router } from "express";
import { ApartmentsController } from "./controllers/apartments.controller";
import { CountriesController } from "./controllers/countries.controller";
import { CitiesController } from "./controllers/cities.controller";
import { AreasController } from "./controllers/areas.controller";
import { ApartmentFeaturesController } from "./controllers/apartment-features.controller";
import multer from "multer";
import { container } from "tsyringe";


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

const getController = <T>(Controller: new (...args: any[]) => T) => {
    return async (req: any, res: any, next: any) => {
        try {
            const controller = container.resolve(Controller);
            if (!req.routeHandler || !(controller as any)[req.routeHandler]) {
                return next(new Error('Invalid route handler'));
            }
            return (controller as any)[req.routeHandler].bind(controller)(req, res, next);
        } catch (error) {
            next(error);
        }
    };
};

export function createRouter(): Router {
    const router = Router();

    // Apartments routes
    router.post(
        "/apartments",
        upload.array('images', 10),
        (req: any, res, next) => {
            req.routeHandler = 'create';
            next();
        },
        getController(ApartmentsController)
    );
    router.get(
        "/apartments",
        (req: any, res, next) => {
            req.routeHandler = 'filter';
            next();
        },
        getController(ApartmentsController)
    );

    // Countries routes
    router.get("/countries/search",
        (req: any, res, next) => {
            req.routeHandler = 'search';
            next();
        },
        getController(CountriesController)
    );
    router.get("/countries",
        (req: any, res, next) => {
            req.routeHandler = 'list';
            next();
        },
        getController(CountriesController)
    );

    // Cities routes
    router.get("/cities/search",
        (req: any, res, next) => {
            req.routeHandler = 'search';
            next();
        },
        getController(CitiesController)
    );
    router.get("/countries/:countryId/cities",
        (req: any, res, next) => {
            req.routeHandler = 'listByCountry';
            next();
        },
        getController(CitiesController)
    );

    // Areas routes
    router.get("/areas/search",
        (req: any, res, next) => {
            req.routeHandler = 'search';
            next();
        },
        getController(AreasController)
    );
    router.get("/cities/:cityId/areas",
        (req: any, res, next) => {
            req.routeHandler = 'listByCity';
            next();
        },
        getController(AreasController)
    );

    // Features routes
    router.get("/apartment/features",
        (req: any, res, next) => {
            req.routeHandler = 'list';
            next();
        },
        getController(ApartmentFeaturesController)
    );

    return router;
}