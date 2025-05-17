import * as bcrypt from "bcrypt";
import { dataSource } from "../config";
import {
    Country,
    City,
    Area,
    ApartmentFeature,
    Apartment,
    ApartmentImage,
    ApartmentFeatureMapping
} from "../data/database/models";

const seedDatabase = async () => {
    console.log("Starting database seeding process...");

    try {
        // Initialize the database connection
        if (!dataSource.isInitialized) {
            await dataSource.initialize();
        }
        const connection = dataSource;
        console.log("Database connection established.");


        // 1. Seed Countries
        const countries = await connection.manager.save(Country, [
            { name: "Egypt", currency: "EGP", isActive: true },
            { name: "UAE", currency: "AED", isActive: true },
            { name: "Saudi Arabia", currency: "SAR", isActive: true },
            { name: "Qatar", currency: "QAR", isActive: true },
            { name: "Kuwait", currency: "KWD", isActive: true },
            { name: "Bahrain", currency: "BHD", isActive: true },
            { name: "Oman", currency: "OMR", isActive: true },
            { name: "Jordan", currency: "JOD", isActive: true },
            { name: "Lebanon", currency: "LBP", isActive: true },
            { name: "Morocco", currency: "MAD", isActive: true },
        ]);
        console.log(`Seeded ${countries.length} countries.`);

        // 2. Seed Cities (linked to countries)
        const egyptId = countries.find((c: Country) => c.name === "Egypt")?.id;
        const uaeId = countries.find((c: Country) => c.name === "UAE")?.id;

        const cities = await connection.manager.save(City, [
            { name: "Cairo", countryId: egyptId, isActive: true },
            { name: "Alexandria", countryId: egyptId, isActive: true },
            { name: "Giza", countryId: egyptId, isActive: true },
            { name: "Sharm El Sheikh", countryId: egyptId, isActive: true },
            { name: "Hurghada", countryId: egyptId, isActive: true },
            { name: "Dubai", countryId: uaeId, isActive: true },
            { name: "Abu Dhabi", countryId: uaeId, isActive: true },
            { name: "Sharjah", countryId: uaeId, isActive: true },
            { name: "Ajman", countryId: uaeId, isActive: true },
            { name: "Ras Al Khaimah", countryId: uaeId, isActive: true },
        ]);
        console.log(`Seeded ${cities.length} cities.`);

        // 3. Seed Areas (linked to cities)
        const cairoId = cities.find((c: City) => c.name === "Cairo")?.id;
        const alexId = cities.find((c: City) => c.name === "Alexandria")?.id;
        const gizaId = cities.find((c: City) => c.name === "Giza")?.id;
        const dubaiId = cities.find((c: City) => c.name === "Dubai")?.id;

        const areas = await connection.manager.save(Area, [
            { name: "Maadi", cityId: cairoId, isActive: true },
            { name: "Zamalek", cityId: cairoId, isActive: true },
            { name: "New Cairo", cityId: cairoId, isActive: true },
            { name: "Heliopolis", cityId: cairoId, isActive: true },
            { name: "Downtown", cityId: cairoId, isActive: true },
            { name: "Montazah", cityId: alexId, isActive: true },
            { name: "Glim", cityId: alexId, isActive: true },
            { name: "Dokki", cityId: gizaId, isActive: true },
            { name: "Sheikh Zayed", cityId: gizaId, isActive: true },
            { name: "Downtown Dubai", cityId: dubaiId, isActive: true },
            { name: "Dubai Marina", cityId: dubaiId, isActive: true },
            { name: "Palm Jumeirah", cityId: dubaiId, isActive: true },
        ]);
        console.log(`Seeded ${areas.length} areas.`);

        // 4. Seed Apartment Features
        const features = await connection.manager.save(ApartmentFeature, [
            { name: "Pool", isActive: true },
            { name: "Gym", isActive: true },
            { name: "Parking", isActive: true },
            { name: "Security", isActive: true },
            { name: "Elevator", isActive: true },
            { name: "Balcony", isActive: true },
            { name: "Garden", isActive: true },
            { name: "Air Conditioning", isActive: true },
            { name: "Furnished", isActive: true },
            { name: "Pet Friendly", isActive: true },
            { name: "Sea View", isActive: true },
            { name: "Concierge", isActive: true },
        ]);
        console.log(`Seeded ${features.length} apartment features.`);

        // 5. Seed Apartments (linked to areas)
        const apartments = [];

        const areaIds = areas.map((area: Area) => area.id);

        // Generate 30 apartments across different areas
        for (let i = 1; i <= 30; i++) {
            const areaId = areaIds[Math.floor(Math.random() * areaIds.length)];
            const apartment = await connection.manager.save(Apartment, {
                title: `Luxury Apartment ${i}`,
                description: `A beautiful apartment with modern design and all amenities. Perfect for families and professionals. This spacious unit offers amazing views and is close to all essential services.`,
                price: 5000 + Math.floor(Math.random() * 15000),
                size: 120 + Math.floor(Math.random() * 180),
                bedrooms: 1 + Math.floor(Math.random() * 4),
                bathrooms: 1 + Math.floor(Math.random() * 3),
                areaId: areaId,
                address: `${Math.floor(Math.random() * 100)} Main Street, Building ${Math.floor(Math.random() * 50)}`,
                longitude: 30 + Math.random() * 5,
                latitude: 30 + Math.random() * 5,
                isAvailable: Math.random() > 0.2, // 80% are available
            });
            apartments.push(apartment);
        }
        console.log(`Seeded ${apartments.length} apartments.`);

        // 6. Seed Apartment Images (linked to apartments)
        const imageNames = [
            'https://images.unsplash.com/photo-1574362848149-11496d93a7c7?q=80&w=2168&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            'https://images.unsplash.com/photo-1570129477492-45c003edd2be?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8aG91c2V8ZW58MHx8MHx8fDA%3D',
            'https://images.unsplash.com/photo-1588880331179-bc9b93a8cb5e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8aG91c2V8ZW58MHx8MHx8fDA%3D',
            'https://images.unsplash.com/photo-1464146072230-91cabc968266?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        ];
        const apartmentImages = [];

        for (const apartment of apartments) {
            // Add 2-4 images per apartment
            const imageCount = 2 + Math.floor(Math.random() * 3);

            for (let i = 0; i < imageCount; i++) {
                const imageName = imageNames[Math.floor(Math.random() * imageNames.length)];
                apartmentImages.push({
                    url: imageName,
                    apartmentId: apartment.id,
                    isActive: true
                });
            }
        }

        await connection.manager.save(ApartmentImage, apartmentImages);
        console.log(`Seeded ${apartmentImages.length} apartment images.`);

        // 7. Seed Apartment Feature Mappings
        const featureMappings = [];

        for (const apartment of apartments) {
            // Add 3-6 features per apartment
            const featureCount = 3 + Math.floor(Math.random() * 4);
            const shuffledFeatures = [...features].sort(() => 0.5 - Math.random());

            for (let i = 0; i < featureCount; i++) {
                if (i < shuffledFeatures.length) {
                    featureMappings.push({
                        apartmentId: apartment.id,
                        featureId: shuffledFeatures[i].id,
                        featureValue: Math.random() > 0.5 ? "Yes" : "Premium"
                    });
                }
            }
        }

        await connection.manager.save(ApartmentFeatureMapping, featureMappings);
        console.log(`Seeded ${featureMappings.length} feature mappings.`);

        console.log("Database seeding completed successfully!");

    } catch (error) {
        console.error("Error seeding database:", error);
        process.exit(1);
    }
};

// Execute seeding
seedDatabase();
