// components/SearchForm.tsx
import { Search, MapPin, Calendar, DollarSign, Home } from 'lucide-react';
import { ApartmentFilters } from '../models/common/filter.model';

interface SearchFormProps {
  onFilterChange: (filters: Partial<ApartmentFilters>) => void;
  filters: ApartmentFilters;
}

export default function SearchForm({ onFilterChange, filters }: SearchFormProps) {
  const handlePriceChange = (range: string) => {
    if (!range) {
      onFilterChange({ minPrice: undefined, maxPrice: undefined });
      return;
    }

    const [min, max] = range.split('-').map(n => n === '+' ? undefined : Number(n));
    onFilterChange({ minPrice: min, maxPrice: max });
  };

  const getPriceValue = () => {
    if (!filters.minPrice && !filters.maxPrice) return '';
    if (filters.minPrice && !filters.maxPrice) return `${filters.minPrice}+`;
    if (!filters.minPrice && filters.maxPrice) return `0-${filters.maxPrice}`;
    return `${filters.minPrice}-${filters.maxPrice}`;
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-8 border border-gray-100">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="space-y-2">
          <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              id="location"
              type="text"
              value={filters.searchTerm ?? ''}
              onChange={(e) => onFilterChange({ searchTerm: e.target.value })}
              placeholder="Enter location"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="city" className="block text-sm font-medium text-gray-700">City</label>
          <div className="relative">
            <Home className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              id="city"
              value={filters.cityId ?? ''}
              onChange={(e) => onFilterChange({ cityId: e.target.value ? Number(e.target.value) : undefined })}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm appearance-none"
            >
              <option value="">Select city</option>
              <option value="1">Cairo</option>
              <option value="2">Alexandria</option>
              <option value="3">Giza</option>
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price Range</label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              id="price"
              value={getPriceValue()}
              onChange={(e) => handlePriceChange(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm appearance-none"
            >
              <option value="">Any price</option>
              <option value="0-1000">$0 - $1,000</option>
              <option value="1000-2000">$1,000 - $2,000</option>
              <option value="2000-3000">$2,000 - $3,000</option>
              <option value="3000-5000">$3,000 - $5,000</option>
              <option value="5000+">$5,000+</option>
            </select>
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
