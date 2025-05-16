import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

interface ImageSliderProps {
    readonly images: readonly string[];
    readonly alt: string;
}

export default function ImageSlider({ images, alt }: ImageSliderProps) {
    const [currentIndex, setCurrentIndex] = useState(0);

    const nextImage = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    };

    const previousImage = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
    };

    if (!images.length) {
        return (
            <div className="relative h-64 md:h-96 mb-6 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                <p className="text-gray-500">No images available</p>
            </div>
        );
    }

    return (
        <div className="relative h-64 md:h-96 mb-6 rounded-lg overflow-hidden group">
            <Image
                src={images[currentIndex] ?? '/placeholder.png'}
                alt={`${alt} - Image ${currentIndex + 1}`}
                fill
                className="object-cover transition-transform duration-500"
            />

            {/* Navigation buttons */}
            <div className="absolute inset-0 flex items-center justify-between p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                    onClick={previousImage}
                    className="p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                    aria-label="Previous image"
                >
                    <ChevronLeft className="w-6 h-6 cursor-pointer" />
                </button>
                <button
                    onClick={nextImage}
                    className="p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                    aria-label="Next image"
                >
                    <ChevronRight className="w-6 h-6 cursor-pointer" />
                </button>
            </div>

            {/* Image counter */}
            <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                {currentIndex + 1} / {images.length}
            </div>
        </div>
    );
}
