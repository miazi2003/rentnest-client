export interface PropertyItem {
  id: string;
  title: string;
  description?: string;
  price?: number | string;
  address?: string;
  location?: string;
  images?: string[];
  category?: { name: string };
  bedrooms?: number;
  bathrooms?: number;
  amenities?: string[];
  isAvailable?: boolean;
  availability?: string;
  status?: string;
  avgRating?: number;
  rating?: number;
  createdAt?: string;
  updatedAt?: string;
}

export function getPropertyAvailability(property: PropertyItem) {
  if (typeof property.isAvailable === "boolean") {
    return property.isAvailable ? "Available" : "Unavailable";
  }

  const value = property.availability || property.status;
  return value ? value.charAt(0).toUpperCase() + value.slice(1).toLowerCase() : null;
}
