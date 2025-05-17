import { useState, useEffect, useCallback } from 'react';
import { X, Upload, Plus, Trash2 } from 'lucide-react';
import { Country } from '../models/domain/country.model';
import { City } from '../models/domain/city.model';
import { Area } from '../models/domain/area.model';
import { ApartmentFeature } from '../models/domain/apartment-feature.model';
import { LocationsService } from '../services/locations.service';
import { ApartmentsService } from '../services/apartments.service';
import { ApartmentFeaturesService } from '../services/apartment-features.service';
import ErrorPopup from './ErrorPopup';

interface CreateApartmentModalProps {
    onClose: () => void;
    onSuccess: () => void;
}

interface FormData {
    title: string;
    description: string;
    price: number;
    bathrooms: number;
    bedrooms: number;
    size: number;
    areaId: number;
    address: string;
    longitude: number;
    latitude: number;
    isAvailable: boolean;
    features: Array<{
        featureId: number;
        featureValue: string;
    }>;
}

const initialFormData: FormData = {
    title: '',
    description: '',
    price: 0,
    bathrooms: 1,
    bedrooms: 1,
    size: 0,
    areaId: 0,
    address: '',
    longitude: 0,
    latitude: 0,
    isAvailable: true,
    features: []
};

export default function CreateApartmentModal({ onClose, onSuccess }: Readonly<CreateApartmentModalProps>) {
    const [formData, setFormData] = useState<FormData>(initialFormData);
    const [files, setFiles] = useState<File[]>([]);
    const [previewUrls, setPreviewUrls] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Location states
    const [countries, setCountries] = useState<Country[]>([]);
    const [cities, setCities] = useState<City[]>([]);
    const [areas, setAreas] = useState<Area[]>([]);
    const [selectedCountry, setSelectedCountry] = useState<number | null>(null);
    const [selectedCity, setSelectedCity] = useState<number | null>(null);

    // Loading states
    const [isLoadingCountries, setIsLoadingCountries] = useState(false);
    const [isLoadingCities, setIsLoadingCities] = useState(false);
    const [isLoadingAreas, setIsLoadingAreas] = useState(false);

    // Feature states
    const [features, setFeatures] = useState<ApartmentFeature[]>([]);
    const [isLoadingFeatures, setIsLoadingFeatures] = useState(false);
    const [selectedFeatures, setSelectedFeatures] = useState<Array<{
        feature: ApartmentFeature;
        value: string;
    }>>([]);

    // Error handling state
    const [showErrorPopup, setShowErrorPopup] = useState(false);

    // Fetch countries on component mount
    useEffect(() => {
        async function fetchCountries() {
            try {
                setIsLoadingCountries(true);
                const data = await LocationsService.listCountries();
                setCountries(data);
            } catch (error) {
                console.error('Error fetching countries:', error);
                setError('Failed to fetch countries');
                setShowErrorPopup(true);
            } finally {
                setIsLoadingCountries(false);
            }
        }
        fetchCountries();
    }, []);

    // Fetch cities when country changes
    useEffect(() => {
        async function fetchCities() {
            if (!selectedCountry) {
                setCities([]);
                return;
            }
            try {
                setIsLoadingCities(true);
                const data = await LocationsService.listCities(selectedCountry);
                setCities(data);
            } catch (error) {
                console.error('Error fetching cities:', error);
                setError('Failed to fetch cities');
                setShowErrorPopup(true);
            } finally {
                setIsLoadingCities(false);
            }
        }
        fetchCities();
    }, [selectedCountry]);

    // Fetch areas when city changes
    useEffect(() => {
        async function fetchAreas() {
            if (!selectedCity) {
                setAreas([]);
                return;
            }
            try {
                setIsLoadingAreas(true);
                const data = await LocationsService.listAreas(selectedCity);
                setAreas(data);
            } catch (error) {
                console.error('Error fetching areas:', error);
                setError('Failed to fetch areas');
                setShowErrorPopup(true);
            } finally {
                setIsLoadingAreas(false);
            }
        }
        fetchAreas();
    }, [selectedCity]);

    // Fetch features on component mount
    useEffect(() => {
        async function fetchFeatures() {
            try {
                setIsLoadingFeatures(true);
                const data = await ApartmentFeaturesService.listFeatures();
                setFeatures(data);
            } catch (error) {
                console.error('Error fetching features:', error);
                setError('Failed to fetch features');
                setShowErrorPopup(true);
            } finally {
                setIsLoadingFeatures(false);
            }
        }
        fetchFeatures();
    }, []);

    // Handle file selection
    const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = Array.from(e.target.files || []);
        setFiles(prev => [...prev, ...selectedFiles]);

        // Generate preview URLs
        const newPreviewUrls = selectedFiles.map(file => URL.createObjectURL(file));
        setPreviewUrls(prev => [...prev, ...newPreviewUrls]);
    }, []);

    // Handle adding a new feature
    const handleAddFeature = () => {
        if (features.length === 0) return;
        setSelectedFeatures(prev => [...prev, { feature: features[0] as ApartmentFeature, value: '' }]);
    };

    // Handle removing a feature
    const handleRemoveFeature = (index: number) => {
        setSelectedFeatures(prev => prev.filter((_, i) => i !== index));
    };

    // Handle feature change
    const handleFeatureChange = (index: number, featureId: number) => {
        const feature = features.find(f => f.id === featureId);
        if (!feature) return;

        setSelectedFeatures(prev => {
            const newFeatures = [...prev];
            newFeatures[index] = { ...newFeatures[index], feature, value: '' };
            return newFeatures;
        });
    };

    // Handle feature value change
    const handleFeatureValueChange = (index: number, value: string) => {
        setSelectedFeatures(prev => {
            const newFeatures = [...prev];
            const updatedFeature = { ...newFeatures[index], value };
            if (updatedFeature.feature) {
                newFeatures[index] = updatedFeature as { feature: ApartmentFeature; value: string };
            }
            return newFeatures;
        });
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsSubmitting(true);

        try {
            const formDataToSend = new FormData();

            // Append each file with the correct field name 'images'
            files.forEach(file => {
                formDataToSend.append('images', file);
            });

            // Add the apartment data as a JSON string
            const apartmentData = {
                ...formData,
                features: selectedFeatures.map(sf => ({
                    featureId: sf.feature.id,
                    featureValue: sf.value
                })),
                isAvailable: true
            };
            formDataToSend.append('apartment', JSON.stringify(apartmentData));

            await ApartmentsService.createApartment(formDataToSend);

            // Cleanup URLs before closing
            previewUrls.forEach(URL.revokeObjectURL);

            onSuccess();
            onClose();
        } catch (err) {
            console.error('Error creating apartment:', err);
            setError('Failed to create apartment');
            setShowErrorPopup(true);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Cleanup preview URLs when component unmounts or when files are removed
    useEffect(() => {
        const urlsToCleanup = [...previewUrls];  // Create a copy of URLs to cleanup
        return () => {
            urlsToCleanup.forEach(URL.revokeObjectURL);
        };
    }, [previewUrls]);

    // Prevent body scroll when modal is open
    useEffect(() => {
        const originalStyle = window.getComputedStyle(document.body).overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = originalStyle;
        };
    }, []);

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto relative">
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
                    disabled={isSubmitting}
                >
                    <X className="w-6 h-6 text-gray-500" />
                </button>

                {/* Form content */}
                <div className="p-6 md:p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Create New Apartment</h2>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Basic Information */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
                                <input
                                    type="text"
                                    id="title"
                                    required
                                    minLength={3}
                                    maxLength={100}
                                    value={formData.title}
                                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-600 focus:ring-2 outline-none"
                                />
                            </div>
                            <div>
                                <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price</label>
                                <input
                                    type="number"
                                    id="price"
                                    required
                                    min="0"
                                    value={formData.price}
                                    onChange={(e) => setFormData(prev => ({ ...prev, price: Number(e.target.value) }))}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-600 focus:ring-2 outline-none"
                                />
                            </div>
                        </div>

                        {/* Property Details */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label htmlFor="size" className="block text-sm font-medium text-gray-700">Size (sqm)</label>
                                <input
                                    type="number"
                                    id="size"
                                    required
                                    min="0"
                                    value={formData.size}
                                    onChange={(e) => setFormData(prev => ({ ...prev, size: Number(e.target.value) }))}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-600 focus:ring-2 outline-none"
                                />
                            </div>
                            <div>
                                <label htmlFor="bedrooms" className="block text-sm font-medium text-gray-700">Bedrooms</label>
                                <input
                                    type="number"
                                    id="bedrooms"
                                    required
                                    min="0"
                                    value={formData.bedrooms}
                                    onChange={(e) => setFormData(prev => ({ ...prev, bedrooms: Number(e.target.value) }))}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-600 focus:ring-2 outline-none"
                                />
                            </div>
                            <div>
                                <label htmlFor="bathrooms" className="block text-sm font-medium text-gray-700">Bathrooms</label>
                                <input
                                    type="number"
                                    id="bathrooms"
                                    required
                                    min="0"
                                    value={formData.bathrooms}
                                    onChange={(e) => setFormData(prev => ({ ...prev, bathrooms: Number(e.target.value) }))}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-600 focus:ring-2 outline-none"
                                />
                            </div>
                        </div>

                        {/* Location */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label htmlFor="country" className="block text-sm font-medium text-gray-700">Country</label>
                                <select
                                    id="country"
                                    value={selectedCountry || ''}
                                    onChange={(e) => setSelectedCountry(e.target.value ? Number(e.target.value) : null)}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-600 focus:ring-2 outline-none"
                                    disabled={isLoadingCountries}
                                >
                                    <option value="">Select a country</option>
                                    {countries.map(country => (
                                        <option key={country.id} value={country.id}>{country.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label htmlFor="city" className="block text-sm font-medium text-gray-700">City</label>
                                <select
                                    id="city"
                                    value={selectedCity || ''}
                                    onChange={(e) => setSelectedCity(e.target.value ? Number(e.target.value) : null)}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-600 focus:ring-2 outline-none"
                                    disabled={isLoadingCities || !selectedCountry}
                                >
                                    <option value="">Select a city</option>
                                    {cities.map(city => (
                                        <option key={city.id} value={city.id}>{city.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label htmlFor="area" className="block text-sm font-medium text-gray-700">Area</label>
                                <select
                                    id="area"
                                    value={formData.areaId || ''}
                                    onChange={(e) => setFormData(prev => ({ ...prev, areaId: Number(e.target.value) }))}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-600 focus:ring-2 outline-none"
                                    disabled={isLoadingAreas || !selectedCity}
                                    required
                                >
                                    <option value="">Select an area</option>
                                    {areas.map(area => (
                                        <option key={area.id} value={area.id}>{area.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Address and Coordinates */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="md:col-span-3">
                                <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
                                <input
                                    type="text"
                                    id="address"
                                    required
                                    minLength={10}
                                    maxLength={200}
                                    value={formData.address}
                                    onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-600 focus:ring-2 outline-none"
                                />
                            </div>
                            <div>
                                <label htmlFor="latitude" className="block text-sm font-medium text-gray-700">Latitude</label>
                                <input
                                    type="number"
                                    id="latitude"
                                    required
                                    step="0.000001"
                                    min="-90"
                                    max="90"
                                    value={formData.latitude}
                                    onChange={(e) => setFormData(prev => ({ ...prev, latitude: Number(e.target.value) }))}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-600 focus:ring-2 outline-none"
                                />
                            </div>
                            <div>
                                <label htmlFor="longitude" className="block text-sm font-medium text-gray-700">Longitude</label>
                                <input
                                    type="number"
                                    id="longitude"
                                    required
                                    step="0.000001"
                                    min="-180"
                                    max="180"
                                    value={formData.longitude}
                                    onChange={(e) => setFormData(prev => ({ ...prev, longitude: Number(e.target.value) }))}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-600 focus:ring-2 outline-none"
                                />
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                            <textarea
                                id="description"
                                required
                                minLength={10}
                                maxLength={500}
                                rows={4}
                                value={formData.description}
                                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-600 focus:ring-2 outline-none"
                            />
                        </div>

                        {/* Features Section */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-medium text-gray-900">Features</h3>
                                <button
                                    type="button"
                                    onClick={handleAddFeature}
                                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                    disabled={isLoadingFeatures || features.length === 0}
                                >
                                    <Plus className="w-4 h-4 mr-2" />
                                    Add Feature
                                </button>
                            </div>

                            {isLoadingFeatures ? (
                                <div className="text-center py-4">Loading features...</div>
                            ) : (
                                <div className="space-y-4">
                                    {selectedFeatures.map((selectedFeature, index) => (
                                        <div key={index} className="flex items-start space-x-4 bg-gray-50 p-4 rounded-lg">
                                            <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700">Feature</label>
                                                    <select
                                                        value={selectedFeature.feature.id}
                                                        onChange={(e) => handleFeatureChange(index, Number(e.target.value))}
                                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-600 focus:ring-2 outline-none"
                                                    >
                                                        {features.filter(f => f.isActive).map(feature => (
                                                            <option key={feature.id} value={feature.id}>
                                                                {feature.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700">Value</label>
                                                    <input
                                                        type="text"
                                                        value={selectedFeature.value}
                                                        onChange={(e) => handleFeatureValueChange(index, e.target.value)}
                                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-600 focus:ring-2 outline-none"
                                                        required
                                                    />
                                                </div>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveFeature(index)}
                                                className="p-2 text-gray-400 hover:text-red-500"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Image Upload */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Images</label>
                            <div className="mt-2">
                                <div className="flex items-center justify-center w-full">
                                    <label className="w-full flex flex-col items-center px-4 py-6 bg-white rounded-lg border-2 border-dashed border-gray-300 cursor-pointer hover:bg-gray-50">
                                        <Upload className="w-8 h-8 text-gray-400" />
                                        <span className="mt-2 text-sm text-gray-500">Click to upload images</span>
                                        <input
                                            type="file"
                                            className="hidden"
                                            multiple
                                            accept="image/*"
                                            onChange={handleFileChange}
                                            disabled={isSubmitting}
                                        />
                                    </label>
                                </div>
                                {previewUrls.length > 0 && (
                                    <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                        {previewUrls.map((url, index) => (
                                            <div key={url} className="relative group">
                                                <img
                                                    src={url}
                                                    alt={`Preview ${index + 1}`}
                                                    className="w-full h-24 object-cover rounded-lg"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        URL.revokeObjectURL(url);
                                                        setPreviewUrls(prev => prev.filter(u => u !== url));
                                                        setFiles(prev => prev.filter((_, i) => i !== index));
                                                    }}
                                                    className="absolute top-1 right-1 p-1 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <X className="w-4 h-4 text-gray-500" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="flex justify-end space-x-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
                                disabled={isSubmitting}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center cursor-pointer"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Creating...
                                    </>
                                ) : 'Create Apartment'}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Error Popup */}
                {showErrorPopup && error && (
                    <ErrorPopup
                        message={error}
                        onClose={() => setShowErrorPopup(false)}
                        showRedirect={true}
                    />
                )}
            </div>
        </div>
    );
}
