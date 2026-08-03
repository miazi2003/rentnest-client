import { PropertyCard } from "./PropertyCard";
import type { PropertyItem } from "./property.types";

interface PropertiesListClientProps {
  properties: PropertyItem[];
}

export default function PropertiesListClient({ properties }: PropertiesListClientProps) {
  return (
    <div className="grid grid-cols-1 gap-7 md:grid-cols-2 xl:grid-cols-3">
      {properties.map((property) => (
        <PropertyCard key={property.id} property={property} />
      ))}
    </div>
  );
}
