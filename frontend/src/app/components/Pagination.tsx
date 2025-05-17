interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: Readonly<PaginationProps>) {
    const getVisiblePages = () => {
        const pages: number[] = [];
        const maxVisible = 5;

        if (totalPages <= maxVisible) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            // Always show first page
            pages.push(1);

            // Show dots if needed
            if (currentPage > 3) {
                pages.push(-1);
            }

            // Show pages around current
            const start = Math.max(2, currentPage - 1);
            const end = Math.min(totalPages - 1, currentPage + 1);

            for (let i = start; i <= end; i++) {
                pages.push(i);
            }

            // Show dots if needed
            if (currentPage < totalPages - 2) {
                pages.push(-1);
            }

            // Always show last page
            pages.push(totalPages);
        }

        return pages;
    };

    const visiblePages = getVisiblePages();

    return (
        <nav aria-label="Page navigation" className="flex justify-center items-center space-x-2 mt-8">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white transition-colors font-medium"
            >
                Previous
            </button>

            {visiblePages.map((page, index) => {
                if (page === -1) {
                    // Use previous and next page numbers to generate a unique key for dots
                    const prevPage = visiblePages[index - 1];
                    const nextPage = visiblePages[index + 1];
                    return (
                        <span key={`dots-${prevPage}-${nextPage}`} className="px-2 py-2 text-gray-400">
                            ...
                        </span>
                    );
                }

                return (
                    <button
                        key={page}
                        onClick={() => onPageChange(page)}
                        className={`px-4 py-2 rounded-lg border font-medium transition-colors ${currentPage === page
                            ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                            }`}
                    >
                        {page}
                    </button>
                );
            })}

            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white transition-colors font-medium"
            >
                Next
            </button>
        </nav>
    );
}