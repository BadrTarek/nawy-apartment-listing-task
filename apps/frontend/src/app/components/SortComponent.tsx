import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { useState } from 'react';
import { SortField, SortOrder } from '../models/common/filter.model';

interface SortProps {
    sortBy?: SortField;
    sortOrder?: SortOrder;
    onSortChange: (sortBy: SortField | undefined, sortOrder: SortOrder | undefined) => void;
}

const SORT_OPTIONS: { label: string; value: SortField }[] = [
    { label: 'Price', value: 'price' },
    { label: 'Date Added', value: 'createdAt' },
    { label: 'Size', value: 'size' },
    { label: 'Bedrooms', value: 'bedrooms' },
    { label: 'Bathrooms', value: 'bathrooms' }
];

export default function SortComponent({ sortBy, sortOrder, onSortChange }: Readonly<SortProps>) {
    const [isOpen, setIsOpen] = useState(false);

    const handleSortClick = (field: SortField) => {
        if (sortBy === field) {
            // Toggle order if same field
            if (sortOrder === 'ASC') {
                onSortChange(field, 'DESC');
            } else if (sortOrder === 'DESC') {
                onSortChange(undefined, undefined);
            } else {
                onSortChange(field, 'ASC');
            }
        } else {
            // New field, default to ASC
            onSortChange(field, 'ASC');
        }
        setIsOpen(false);
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg border bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400 font-medium transition-all"
            >
                <ArrowUpDown className="w-4 h-4" />
                <span>{sortBy ? `Sort by: ${SORT_OPTIONS.find(opt => opt.value === sortBy)?.label}` : 'Sort by'}</span>
                {sortBy && (sortOrder === 'ASC' ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />)}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 py-2 w-48 bg-white rounded-lg shadow-xl z-10 border border-gray-200">
                    {SORT_OPTIONS.map((option) => (
                        <button
                            key={option.value}
                            onClick={() => handleSortClick(option.value)}
                            className={`w-full px-4 py-2 text-left hover:bg-gray-50 text-gray-600 ${sortBy === option.value ? 'bg-gray-50 font-medium' : ''
                                }`}
                        >
                            <div className="flex items-center justify-between">
                                <span>{option.label}</span>
                                {sortBy === option.value && (
                                    sortOrder === 'ASC' ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />
                                )}
                            </div>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}