// components/PropertyCard.tsx
import { Home } from 'lucide-react';
import Image from 'next/image';
import { Apartment } from '../models/domain/apartment.model';

interface PropertyCardProps {
  readonly property: Apartment;
}

export default function PropertyCard({ property }: Readonly<PropertyCardProps>) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <div className="relative">
        <Image
          src={property.images?.[0] ?? '/placeholder.png'}
          alt="Property Image"
          width={400}
          height={300}
          className="w-full h-64 object-cover"
        />
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2 hover:text-blue-600 transition-colors">
          {property.title}
        </h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{property.address}</p>

        <div className="flex flex-wrap items-center gap-4 mb-4 text-sm text-gray-600">
          <div className="flex items-center">
            <Home className="w-4 h-4 mr-1" />
            <span className="font-medium">{property.bedrooms}</span> Bedroom
          </div>
          <div className="flex items-center">
            <span className="font-medium">{property.bathrooms}</span> Bathroom
          </div>
          <div className="flex items-center">
            <span className="font-medium">{property.size}</span> SQ
          </div>
        </div>

        <div className="flex flex-col xs:flex-row justify-between items-start xs:items-center gap-4">
          <div className="text-2xl font-bold text-gray-900">
            <span className="text-blue-600">${property.price}</span>
          </div>
          <div className="flex flex-col xs:flex-row space-y-2 xs:space-y-0 xs:space-x-2 w-full xs:w-auto">
            <button className="w-full xs:w-auto px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium">
              Open Map
            </button>
            <button className="w-full xs:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
              View Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}