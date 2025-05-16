import { config } from '../config';
import { ApartmentFilters } from '../models/common/filter.model';
import { ApartmentResponse } from '../models/dtos/apartment.dto';

export class ApartmentsService {
    private static readonly apiUrl = `${config.apiBaseUrl}/api/apartments`;

    static async getApartments(filters: ApartmentFilters): Promise<ApartmentResponse> {
        const queryParams = new URLSearchParams();

        // Add filters to query params
        Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined) {
                queryParams.append(key, value.toString());
            }
        });

        const response = await fetch(`${this.apiUrl}?${queryParams}`);

        if (!response.ok) {
            throw new Error('Failed to fetch apartments');
        }

        return response.json();
    }
}
