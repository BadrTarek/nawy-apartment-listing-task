import { ApartmentFeature } from '../models/domain/apartment-feature.model';
import { config } from '../config';

export class ApartmentFeaturesService {
    private static readonly BASE_URL = `${config.apiBaseUrl}/api/apartment/features`;

    static async listFeatures(): Promise<ApartmentFeature[]> {
        const response = await fetch(this.BASE_URL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch features');
        }

        return response.json();
    }
} 