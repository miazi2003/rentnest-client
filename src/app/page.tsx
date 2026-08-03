import { HomeHero } from "@/components/home/HomeHero";
import { HomeAwaySection } from "@/components/home/HomeAwaySection";
import { PropertyCarouselSection } from "@/components/home/PropertyCarouselSection";
import propertyAction from "@/app/features/property/actions/propertyAction";

export default async function HomePage() {
  const response = await propertyAction();
  const properties = Array.isArray(response?.data) ? response.data : [];

  return (
    <>
      <HomeHero />
      <HomeAwaySection />
      <PropertyCarouselSection properties={properties} />
    </>
  );
}
