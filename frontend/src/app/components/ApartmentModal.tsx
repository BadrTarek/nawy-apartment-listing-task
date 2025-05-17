import { X } from 'lucide-react';
import { useEffect } from 'react';
import { Apartment } from '../models/domain/apartment.model';
import ImageSlider from './ImageSlider';

interface ApartmentModalProps {
    apartment: Apartment;
    onClose: () => void;
}

export default function ApartmentModal({ apartment, onClose }: Readonly<ApartmentModalProps>) {
    // Disable body scroll when modal is open
    useEffect(() => {
        // Save current scroll position and any existing overflow setting
        const scrollY = window.scrollY;
        const originalStyle = {
            overflow: document.body.style.overflow,
            position: document.body.style.position,
            width: document.body.style.width,
            top: document.body.style.top,
            paddingRight: document.body.style.paddingRight
        };

        // Calculate width of scrollbar to prevent content shift
        const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

        // Disable scrolling on the background
        document.body.style.overflow = 'hidden';
        document.body.style.position = 'fixed';
        document.body.style.width = '100%';
        document.body.style.top = `-${scrollY}px`;
        // Add padding to prevent content shift
        document.body.style.paddingRight = `${scrollbarWidth}px`;

        // Cleanup function to restore scrolling when modal is closed
        return () => {
            document.body.style.overflow = originalStyle.overflow;
            document.body.style.position = originalStyle.position;
            document.body.style.width = originalStyle.width;
            document.body.style.top = originalStyle.top;
            document.body.style.paddingRight = originalStyle.paddingRight;
            window.scrollTo(0, scrollY);
        };
    }, []);

    return (
        <div
            className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4"
            onClick={(e) => {
                // Close modal when clicking the backdrop
                if (e.target === e.currentTarget) {
                    onClose();
                }
            }}
        >
            <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                    <X className="w-6 h-6 text-gray-500" />
                </button>

                {/* Content */}
                <div className="p-6 md:p-8">
                    {/* Image slider */}
                    <ImageSlider
                        images={apartment.images || []}
                        alt={apartment.title}
                    />

                    {/* Title and price */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 md:mb-0">
                            {apartment.title}
                        </h2>
                        <div className="text-2xl font-bold text-green-700">
                            {apartment.price} {apartment.currency}
                        </div>
                    </div>

                    {/* Location */}
                    <div className="text-gray-600 mb-6">
                        <p>{apartment.address}</p>
                        <p className="mt-1">
                            {apartment.areaName}, {apartment.cityName}, {apartment.countryName}
                        </p>
                    </div>

                    {/* Property details */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        <div className="p-4 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-700">Size</p>
                            <p className="text-lg font-semibold text-gray-400">{apartment.size} sqm</p>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-700">Bedrooms</p>
                            <p className="text-lg font-semibold text-gray-400">{apartment.bedrooms}</p>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-700">Bathrooms</p>
                            <p className="text-lg font-semibold text-gray-400">{apartment.bathrooms}</p>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-700">Price per sqm</p>
                            <p className="text-lg font-semibold text-gray-400">
                                {(apartment.price / apartment.size).toFixed(2)} {apartment.currency}
                            </p>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="mb-8">
                        <h3 className="text-xl font-semibold mb-3 text-gray-700">Description</h3>
                        <p className="text-gray-600 whitespace-pre-line">{apartment.description}</p>
                    </div>

                    {/* Features */}
                    {apartment.features && apartment.features.length > 0 && (
                        <div>
                            <h3 className="text-xl font-semibold mb-4 text-gray-700">Features</h3>
                            <div className="overflow-x-auto">
                                <table className="w-full border-collapse">
                                    <thead>
                                        <tr>
                                            <th className="text-left py-3 px-4 bg-gray-50 border-b border-gray-200 font-semibold text-gray-700">Feature</th>
                                            <th className="text-left py-3 px-4 bg-gray-50 border-b border-gray-200 font-semibold text-gray-700">Value</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {apartment.features.map((feature) => (
                                            <tr
                                                key={`${feature.name}-${feature.value}`}
                                                className="hover:bg-gray-50 transition-colors"
                                            >
                                                <td className="py-3 px-4 text-gray-700">{feature.name}</td>
                                                <td className="py-3 px-4 text-gray-600">{feature.value}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
