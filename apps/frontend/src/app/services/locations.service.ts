import { config } from '../config';
import { Area } from '../models/domain/area.model';
import { City } from '../models/domain/city.model';
import { Country } from '../models/domain/country.model';

export class LocationsService {

    static async listCountries(): Promise<Country[]> {
        const apiUrl = `${config.apiBaseUrl}/api/countries`;
        const response = await fetch(`${apiUrl}`);
        if (!response.ok) {
            throw new Error('Failed to fetch countries');
        }
        return response.json();
    }

    static async listCities(countryId: number): Promise<City[]> {
        const apiUrl = `${config.apiBaseUrl}/api/countries/${countryId}/cities`;
        const response = await fetch(`${apiUrl}`);
        if (!response.ok) {
            throw new Error('Failed to fetch cities');
        }
        return response.json();
    }

    static async listAreas(cityId: number): Promise<Area[]> {
        const apiUrl = `${config.apiBaseUrl}/api/cities/${cityId}/areas`;
        const response = await fetch(`${apiUrl}`);
        if (!response.ok) {
            throw new Error('Failed to fetch areas');
        }
        return response.json();
    }
}
