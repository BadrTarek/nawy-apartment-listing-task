'use client';

import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import Image from 'next/image';
import { ApartmentsService } from '../services/apartments.service';
import SearchForm from '../components/SearchForm';
import FilterControls from '../components/FilterControls';
import PropertyCard from '../components/PropertyCard';
import Pagination from '../components/Pagination';
import { ApartmentResponse } from '../models/dtos/apartment.dto';
import { ApartmentFilters } from '../models/common/filter.model';

// Navigation links for better maintainability
const NAV_LINKS = [
    { href: '#rent', label: 'Rent' },
    { href: '#buy', label: 'Buy' },
    { href: '#sell', label: 'Sell' },
    { href: '#manage', label: 'Manage Property' },
    { href: '#tour', label: 'Virtual Tour' }
];

export default function ApartmentsClient() {
    // UI state
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

    // Fetch apartments when filters change
    useEffect(() => {
        const fetchApartments = async () => {
            try {
                const data = await ApartmentsService.getApartments(filters);
                setApartments(data);
            } catch (error) {
                console.error('Error fetching apartments:', error);
            }
        };
        fetchApartments();
    }, [filters, setApartments]);

    // Handle filter changes
    const handleFilterChange = (newFilters: Partial<ApartmentFilters>) => {
        setFilters(prev => ({
            ...prev,
            ...newFilters
        }));
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16 md:h-20">
                        {/* Logo */}
                        <div className="text-2xl font-bold text-black">Nawy</div>

                        {/* Desktop Navigation */}
                        <nav className="hidden md:flex space-x-8">
                            {NAV_LINKS.map(link => (
                                <a
                                    key={link.href}
                                    href={link.href}
                                    className="text-gray-700 hover:text-blue-600 font-medium"
                                >
                                    {link.label}
                                </a>
                            ))}
                        </nav>

                        {/* Profile Section */}
                        <div className="flex items-center space-x-4">
                            <div className="relative p-2">
                                <Image
                                    src="/images/property1.jpg"
                                    alt="Profile"
                                    width={40}
                                    height={40}
                                    className="rounded-full"
                                />
                            </div>

                            {/* Mobile menu button */}
                            <button
                                onClick={() => setMobileMenuOpen(true)}
                                className="md:hidden p-2"
                            >
                                <Menu className="w-6 h-6" />
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Mobile Menu Overlay */}
            {mobileMenuOpen && (
                <div className="fixed inset-0 z-50 bg-black bg-opacity-50">
                    <div className="bg-white w-64 h-full">
                        <div className="p-4 flex justify-between items-center border-b">
                            <h2 className="text-lg font-semibold">Menu</h2>
                            <button onClick={() => setMobileMenuOpen(false)}>
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <nav className="p-4 space-y-4">
                            {NAV_LINKS.map(link => (
                                <a
                                    key={link.href}
                                    href={link.href}
                                    className="block text-gray-700 hover:text-blue-600 font-medium"
                                >
                                    {link.label}
                                </a>
                            ))}
                        </nav>
                    </div>
                </div>
            )}

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Title */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                        Discover the Best Rental Properties
                    </h1>
                    <p className="text-xl text-gray-600">with Our Home Rent Service</p>
                </div>

                {/* Search Form */}
                <SearchForm
                    filters={filters}
                    onFilterChange={handleFilterChange}
                />

                {/* Results Info and Controls */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                    <div className="text-gray-600">
                        Showing {((filters.page - 1) * filters.limit) + 1}-{Math.min(filters.page * filters.limit, apartments.meta.total)} of {apartments.meta.total} apartments
                    </div>

                    <FilterControls />
                </div>

                {/* Property Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {apartments.data.map((property) => (
                        <PropertyCard key={property.id} property={property} />
                    ))}
                </div>

                {/* Pagination */}
                <Pagination
                    currentPage={filters.page}
                    totalPages={apartments.meta.totalPages}
                    onPageChange={(page) => handleFilterChange({ page })}
                />
            </main>
        </div>
    );
}
