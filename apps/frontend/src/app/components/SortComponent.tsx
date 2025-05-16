import { ArrowUpDown } from 'lucide-react';

export default function SortComponent() {
    return (
        <div className="flex flex-wrap items-center gap-3">
            <button className="flex items-center space-x-2 px-4 py-2 rounded-lg border bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400 font-medium transition-all">
                <ArrowUpDown className="w-4 h-4" />
                <span>Sort by</span>
            </button>
        </div>
    );
}