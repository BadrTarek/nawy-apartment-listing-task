import { X, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface ErrorPopupProps {
    message: string;
    onClose: () => void;
    showRedirect?: boolean;
}

export default function ErrorPopup({ message, onClose, showRedirect = true }: Readonly<ErrorPopupProps>) {
    const router = useRouter();

    const handleRedirect = () => {
        onClose();
        // Use a slight delay to ensure the modal is closed before navigation
        setTimeout(() => {
            router.push('/apartments');
            // If we're already on /apartments, force a refresh
            if (window.location.pathname === '/apartments') {
                window.location.reload();
            }
        }, 100);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md m-4 border-t-4 border-red-500">
                <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                            <AlertCircle className="w-6 h-6 text-red-500" />
                        </div>
                        <h3 className="text-lg font-bold text-red-700">Error</h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-red-50 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-500 hover:text-red-500" />
                    </button>
                </div>

                <div className="pl-9">
                    <p className="text-gray-900 font-medium mb-6">{message}</p>

                    <div className="flex justify-end space-x-3">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 border border-red-200 text-red-700 rounded-lg hover:bg-red-50 transition-colors font-medium"
                        >
                            Close
                        </button>
                        {showRedirect && (
                            <button
                                onClick={handleRedirect}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                            >
                                Go to Apartments
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
