import { Map, Eye, Filter, ArrowUpDown } from 'lucide-react';
import { ApartmentFilters } from '../models/common/filter.model';

interface FilterControlsProps {
    mapView: boolean;
    setMapView: (value: boolean) => void;
    verifiedOnly: boolean;
    setVerifiedOnly: (value: boolean) => void;
    showDropdown: boolean;
    setShowDropdown: (value: boolean) => void;
    onFilterChange: (filters: Partial<ApartmentFilters>) => void;
    filters: ApartmentFilters;
}

export default function FilterControls({
    mapView,
    setMapView,
    verifiedOnly,
    setVerifiedOnly,
    showDropdown,
    setShowDropdown,
    onFilterChange,
    filters
}: Readonly<FilterControlsProps>) {
    return (
        <div className="flex flex-wrap items-center gap-3">
            <button
                onClick={() => setMapView(!mapView)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg border font-medium transition-all ${mapView
                    ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400'
                    }`}
            >
                <Map className="w-4 h-4" />
                <span>Map View</span>
            </button>

            <button
                onClick={() => setVerifiedOnly(!verifiedOnly)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg border font-medium transition-all ${verifiedOnly
                    ? 'bg-green-600 text-white border-green-600 shadow-md'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400'
                    }`}
            >
                <Eye className="w-4 h-4" />
                <span>Verified Only</span>
            </button>

            <div className="relative">
                <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="flex items-center space-x-2 px-4 py-2 rounded-lg border bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400 font-medium transition-all"
                >
                    <Filter className="w-4 h-4" />
                    <span>Filter</span>
                </button>

                {showDropdown && (
                    <div className="absolute top-full mt-2 right-0 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                        <div className="p-4 space-y-4">
                            <div>
                                <label htmlFor="area" className="block text-sm font-medium text-gray-700 mb-2">Area</label>
                                <select
                                    id="area"
                                    value={filters.areaId ?? ''}
                                    onChange={(e) => onFilterChange({ areaId: e.target.value ? Number(e.target.value) : undefined })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                >
                                    <option value="">Any</option>
                                    <option value="1">New Cairo</option>
                                    <option value="2">6th of October</option>
                                    <option value="3">Maadi</option>
                                    <option value="4">Zamalek</option>
                                </select>
                            </div>

                            <div>
                                <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                                <select
                                    id="country"
                                    value={filters.countryId ?? ''}
                                    onChange={(e) => onFilterChange({ countryId: e.target.value ? Number(e.target.value) : undefined })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                >
                                    <option value="">Any</option>
                                    <option value="1">Egypt</option>
                                </select>
                            </div>

                            <div className="pt-2 border-t">
                                <button
                                    onClick={() => {
                                        setShowDropdown(false);
                                        onFilterChange({ page: 1 }); // Reset to first page when applying filters
                                    }}
                                    className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                                >
                                    Apply Filters
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <button className="flex items-center space-x-2 px-4 py-2 rounded-lg border bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400 font-medium transition-all">
                <ArrowUpDown className="w-4 h-4" />
                <span>Sort by</span>
            </button>
        </div>
    );
}