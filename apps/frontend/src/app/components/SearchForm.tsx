import { Search, MapPin, Calendar, DollarSign } from 'lucide-react';
import { useEffect, useState } from 'react';
import { ApartmentFilters } from '../models/common/filter.model';
import { LocationsService } from '../services/locations.service';
import { Country } from '../models/domain/country.model';
import { City } from '../models/domain/city.model';
import { Area } from '../models/domain/area.model';

interface SearchFormProps {
  onFilterChange: (filters: Partial<ApartmentFilters>) => void;
  filters: ApartmentFilters;
}

export default function SearchForm({ onFilterChange, filters }: Readonly<SearchFormProps>) {
  const [countries, setCountries] = useState<Country[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);
  const [isLoadingCountries, setIsLoadingCountries] = useState(false);
  const [isLoadingCities, setIsLoadingCities] = useState(false);
  const [isLoadingAreas, setIsLoadingAreas] = useState(false);

  // Fetch countries on component mount
  useEffect(() => {
    async function fetchCountries() {
      try {
        setIsLoadingCountries(true);
        const countriesData = await LocationsService.listCountries();
        setCountries(countriesData);
      } catch (error) {
        console.error('Error fetching countries:', error);
      } finally {
        setIsLoadingCountries(false);
      }
    }
    fetchCountries();
  }, []);

  // Fetch cities when country changes
  useEffect(() => {
    async function fetchCities() {
      if (!filters.countryId) {
        setCities([]);
        return;
      }
      try {
        setIsLoadingCities(true);
        const citiesData = await LocationsService.listCities(filters.countryId);
        setCities(citiesData);
      } catch (error) {
        console.error('Error fetching cities:', error);
      } finally {
        setIsLoadingCities(false);
      }
    }
    fetchCities();
  }, [filters.countryId]);

  // Fetch areas when city changes
  useEffect(() => {
    async function fetchAreas() {
      if (!filters.cityId) {
        setAreas([]);
        return;
      }
      try {
        setIsLoadingAreas(true);
        const areasData = await LocationsService.listAreas(filters.cityId);
        setAreas(areasData);
      } catch (error) {
        console.error('Error fetching areas:', error);
      } finally {
        setIsLoadingAreas(false);
      }
    }
    fetchAreas();
  }, [filters.cityId]);

  // When country changes, reset city and area
  const handleCountryChange = (countryId: number | undefined) => {
    onFilterChange({
      countryId,
      cityId: undefined,
      areaId: undefined
    });
  };

  // When city changes, reset area
  const handleCityChange = (cityId: number | undefined) => {
    onFilterChange({
      cityId,
      areaId: undefined
    });
  };

  const handlePriceChange = (type: 'min' | 'max', value: string) => {
    const numValue = value === '' ? undefined : Number(value);
    onFilterChange({
      ...(type === 'min' ? { minPrice: numValue } : { maxPrice: numValue })
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-8 border border-gray-100">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="space-y-2">
          {/* Country select */}
          <label htmlFor="country" className="block text-sm font-medium text-gray-700">Country</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              id="country"
              value={filters.countryId ?? ''}
              onChange={(e) => handleCountryChange(e.target.value ? Number(e.target.value) : undefined)}
              disabled={isLoadingCountries}
              className="focus:outline-none w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm appearance-none disabled:bg-gray-100 text-gray-600"
            >
              <option value="">Select country</option>
              {countries.map(country => (
                <option key={country.id} value={country.id}>{country.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-2">
          {/* City select */}
          <label htmlFor="city" className="block text-sm font-medium text-gray-700">City</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              id="city"
              value={filters.cityId ?? ''}
              onChange={(e) => handleCityChange(e.target.value ? Number(e.target.value) : undefined)}
              disabled={isLoadingCities || !filters.countryId}
              className="focus:outline-none w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm appearance-none disabled:bg-gray-100 text-gray-600"
            >
              <option value="">Select city</option>
              {cities.map(city => (
                <option key={city.id} value={city.id}>{city.name}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="space-y-2">
          <label htmlFor="area" className="block text-sm font-medium text-gray-700">Area</label>
          {/* Area select */}
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              id="area"
              value={filters.areaId ?? ''}
              onChange={(e) => onFilterChange({ areaId: e.target.value ? Number(e.target.value) : undefined })}
              disabled={isLoadingAreas || !filters.cityId}
              className="focus:outline-none w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm appearance-none disabled:bg-gray-100 text-gray-600"
            >
              <option value="">Select area</option>
              {areas.map(area => (
                <option key={area.id} value={area.id}>{area.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="price-range" className="block text-sm font-medium text-gray-700">Price Range</label>
          <div className="flex items-center space-x-2">
            <div className="relative flex-1">
              <DollarSign aria-hidden="true" className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="number"
                id="min-price"
                placeholder="Min"
                min="0"
                value={filters.minPrice ?? ''}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handlePriceChange('min', e.target.value)}
                className="focus:outline-none w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-600"
              />
            </div>
            <div className="flex-none text-gray-500">to</div>
            <div className="relative flex-1">
              <DollarSign aria-hidden="true" className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="number"
                id="max-price"
                placeholder="Max"
                min="0"
                value={filters.maxPrice ?? ''}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handlePriceChange('max', e.target.value)}
                className="focus:outline-none w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-600"
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="availability" className="block text-sm font-medium text-gray-700">Availability</label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              id="availability"
              value={filters.isAvailable === undefined ? '' : String(filters.isAvailable)}
              onChange={(e) => onFilterChange({ isAvailable: e.target.value === '' ? undefined : e.target.value === 'true' })}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm appearance-none"
            >
              <option value="">Any availability</option>
              <option value="true">Available</option>
              <option value="false">Not Available</option>
            </select>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <button
          onClick={() => onFilterChange({ page: 1 })} // Reset to first page when searching
          className="w-full md:w-auto px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
        >
          <Search className="w-5 h-5" />
          <span>Search Properties</span>
        </button>
      </div>
    </div>
  );
}
