import { Filter, MapPin, DollarSign } from 'lucide-react';
import { useEffect, useState } from 'react';
import { ApartmentFilters } from '../models/common/filter.model';
import { LocationsService } from '../services/locations.service';
import { Country } from '../models/domain/country.model';
import { City } from '../models/domain/city.model';
import { Area } from '../models/domain/area.model';

interface FilterFormProps {
  onFilterChange: (filters: Partial<ApartmentFilters>) => void;
  filters: ApartmentFilters;
}

export default function FilterComponent({ onFilterChange, filters }: Readonly<FilterFormProps>) {
  const [countries, setCountries] = useState<Country[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);
  const [isLoadingCountries, setIsLoadingCountries] = useState(false);
  const [isLoadingCities, setIsLoadingCities] = useState(false);
  const [isLoadingAreas, setIsLoadingAreas] = useState(false);

  // Local form state
  const [formValues, setFormValues] = useState<Partial<ApartmentFilters>>({
    countryId: filters.countryId,
    cityId: filters.cityId,
    areaId: filters.areaId,
    minPrice: filters.minPrice,
    maxPrice: filters.maxPrice,
    bedrooms: filters.bedrooms,
    bathrooms: filters.bathrooms
  });

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
      if (!formValues.countryId) {
        setCities([]);
        return;
      }
      try {
        setIsLoadingCities(true);
        const citiesData = await LocationsService.listCities(formValues.countryId);
        setCities(citiesData);
      } catch (error) {
        console.error('Error fetching cities:', error);
      } finally {
        setIsLoadingCities(false);
      }
    }
    fetchCities();
  }, [formValues.countryId]);

  // Fetch areas when city changes
  useEffect(() => {
    async function fetchAreas() {
      if (!formValues.cityId) {
        setAreas([]);
        return;
      }
      try {
        setIsLoadingAreas(true);
        const areasData = await LocationsService.listAreas(formValues.cityId);
        setAreas(areasData);
      } catch (error) {
        console.error('Error fetching areas:', error);
      } finally {
        setIsLoadingAreas(false);
      }
    }
    fetchAreas();
  }, [formValues.cityId]);

  // When country changes, reset city and area
  const handleCountryChange = (countryId: number | undefined) => {
    setFormValues(prev => ({
      ...prev,
      countryId,
      cityId: undefined,
      areaId: undefined
    }));
  };

  // When city changes, reset area
  const handleCityChange = (cityId: number | undefined) => {
    setFormValues(prev => ({
      ...prev,
      cityId,
      areaId: undefined
    }));
  };

  const handlePriceChange = (type: 'min' | 'max', value: string) => {
    const numValue = value === '' ? undefined : Number(value);
    setFormValues(prev => ({
      ...prev,
      ...(type === 'min' ? { minPrice: numValue } : { maxPrice: numValue })
    }));
  };

  const handleBedroomsChange = (value: string) => {
    setFormValues(prev => ({
      ...prev,
      bedrooms: value === '' ? undefined : Number(value)
    }));
  };

  const handleBathroomsChange = (value: string) => {
    setFormValues(prev => ({
      ...prev,
      bathrooms: value === '' ? undefined : Number(value)
    }));
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    onFilterChange({ ...formValues, page: 1 });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-6 mb-8 border border-gray-100">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="space-y-2">
          {/* Country select */}
          <label htmlFor="country" className="block text-sm font-medium text-gray-700">Country</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              id="country"
              value={formValues.countryId ?? ''}
              onChange={(e) => handleCountryChange(e.target.value ? Number(e.target.value) : undefined)}
              disabled={isLoadingCountries}
              className="focus:outline-none w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm appearance-none disabled:bg-gray-100 text-gray-600"
              onKeyDown={handleKeyDown}
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
              value={formValues.cityId ?? ''}
              onChange={(e) => handleCityChange(e.target.value ? Number(e.target.value) : undefined)}
              disabled={isLoadingCities || !formValues.countryId}
              className="focus:outline-none w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm appearance-none disabled:bg-gray-100 text-gray-600"
              onKeyDown={handleKeyDown}
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
              value={formValues.areaId ?? ''}
              onChange={(e) => setFormValues(prev => ({ ...prev, areaId: e.target.value ? Number(e.target.value) : undefined }))}
              disabled={isLoadingAreas || !formValues.cityId}
              className="focus:outline-none w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm appearance-none disabled:bg-gray-100 text-gray-600"
              onKeyDown={handleKeyDown}
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
                value={formValues.minPrice ?? ''}
                onChange={(e) => handlePriceChange('min', e.target.value)}
                className="focus:outline-none w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-600"
                onKeyDown={handleKeyDown}
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
                value={formValues.maxPrice ?? ''}
                onChange={(e) => handlePriceChange('max', e.target.value)}
                className="focus:outline-none w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-600"
                onKeyDown={handleKeyDown}
              />
            </div>
          </div>
        </div>

        {/* Bedrooms */}
        <div className="space-y-2">
          <label htmlFor="bedrooms" className="block text-sm font-medium text-gray-700">Bedrooms</label>
          <div className="relative">
            <input
              type="number"
              id="bedrooms"
              placeholder="Number of bedrooms"
              min="0"
              value={formValues.bedrooms ?? ''}
              onChange={(e) => handleBedroomsChange(e.target.value)}
              className="focus:outline-none w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-600"
              onKeyDown={handleKeyDown}
            />
          </div>
        </div>

        {/* Bathrooms */}
        <div className="space-y-2">
          <label htmlFor="bathrooms" className="block text-sm font-medium text-gray-700">Bathrooms</label>
          <div className="relative">
            <input
              type="number"
              id="bathrooms"
              placeholder="Number of bathrooms"
              min="0"
              value={formValues.bathrooms ?? ''}
              onChange={(e) => handleBathroomsChange(e.target.value)}
              className="focus:outline-none w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-600"
              onKeyDown={handleKeyDown}
            />
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <button
          type="submit"
          className="w-full md:w-auto px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
        >
          <Filter className="w-5 h-5" />
          <span>Apply Filters</span>
        </button>
      </div>
    </form>
  );
}
