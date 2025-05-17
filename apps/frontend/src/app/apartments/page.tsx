'use client';

import { useState, useEffect, useMemo } from 'react';
import { ApartmentsService } from '../services/apartments.service';
import FilterComponent from '../components/FilterComponent';
import SortComponent from '../components/SortComponent';
import PropertyCard from '../components/PropertyCard';
import Pagination from '../components/Pagination';
import { ApartmentResponse } from '../models/dtos/apartment.dto';
import { ApartmentFilters } from '../models/common/filter.model';
import Spinner from '../components/Spinner';
import CreateApartmentModal from '../components/CreateApartmentModal';
import { PlusSquare } from 'lucide-react';

export default function ApartmentsClient() {
    // UI state
    const [isLoading, setIsLoading] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);

    // Apartments state
    const [apartments, setApartments] = useState<ApartmentResponse>({
        data: [],
        meta: {
            total: 0,
            currentPage: 1,
            itemsPerPage: 10,
            totalPages: 0
        }
    });

    // Filters state
    const [filters, setFilters] = useState<ApartmentFilters>({
        page: 1,
        limit: 10
    });

    // Define fetchApartments with useMemo
    const fetchApartments = useMemo(() => async () => {
        try {
            setIsLoading(true);
            const data = await ApartmentsService.getApartments(filters);
            setApartments(data);
        } catch (error) {
            console.error('Error fetching apartments:', error);
        } finally {
            setIsLoading(false);
        }
    }, [filters, setIsLoading, setApartments]);

    useEffect(() => {
        // Only fetch when page changes or when limit changes
        if (filters.page || filters.limit) {
            void fetchApartments();
        }
    }, [filters, fetchApartments]);

    // Handle filter changes
    const handleFilterChange = (newFilters: Partial<ApartmentFilters>) => {
        setFilters(prev => ({
            ...prev,
            ...newFilters
        }));
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Title */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                        Discover Nawy Apartments
                    </h1>
                    <p className="text-xl text-gray-600">with the best prices</p>
                </div>

                {/* Search Form */}
                <FilterComponent
                    filters={filters}
                    onFilterChange={handleFilterChange}
                />

                {/* Results Info and Controls */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                    <div className="text-gray-600">
                        Showing {((filters.page - 1) * filters.limit) + 1}-{Math.min(filters.page * filters.limit, apartments.meta.total)} of {apartments.meta.total} apartments
                    </div>

                    <SortComponent
                        sortBy={filters.sortBy}
                        sortOrder={filters.sortOrder}
                        onSortChange={(sortBy, sortOrder) => handleFilterChange({ sortBy, sortOrder })}
                    />
                </div>

                {/* Property Grid */}
                {isLoading ? (
                    <div className="flex justify-center items-center py-10">
                        <Spinner />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        {apartments.data.map((property) => (
                            <PropertyCard key={property.id} property={property} />
                        ))}
                    </div>
                )}

                {/* Pagination */}
                <Pagination
                    currentPage={filters.page}
                    totalPages={apartments.meta.totalPages}
                    onPageChange={(page) => handleFilterChange({ page })}
                />

                {/* Add Apartment Button */}
                <div className="fixed bottom-4 right-4">
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="flex items-center justify-center bg-blue-600 text-white rounded-full p-3 shadow-md hover:bg-blue-700 transition-all duration-200 hover:scale-105 cursor-pointer"
                    >
                        <PlusSquare className="w-6 h-6" />
                        <span className="ml-2 mr-1">Add Apartment</span>
                    </button>
                </div>

                {/* Create Apartment Modal */}
                {showCreateModal && (
                    <CreateApartmentModal
                        onClose={() => setShowCreateModal(false)}
                        onSuccess={() => {
                            setShowCreateModal(false);
                            fetchApartments();
                        }}
                    />
                )}
            </main>
        </div>
    );
}
