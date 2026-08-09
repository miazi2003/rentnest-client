import { HomeHero } from "@/components/home/HomeHero";
import { CategoryBrowseSection } from "@/components/home/CategoryBrowseSection";
import { PropertyCarouselSection } from "@/components/home/PropertyCarouselSection";
import { HowItWorksSection } from "@/components/home/HowItWorksSection";
import { HomeAwaySection } from "@/components/home/HomeAwaySection";
import { PopularLocationsSection } from "@/components/home/PopularLocationsSection";
import { PropertyStatsSection } from "@/components/home/PropertyStatsSection";
import { ReviewsSection } from "@/components/home/ReviewsSection";
import { HomeFaqSection } from "@/components/home/HomeFaqSection";
import { FinalCtaSection } from "@/components/home/FinalCtaSection";

import propertyAction from "@/app/features/property/actions/propertyAction";
import { getCategoriesAction } from "@/app/features/category/actions/categoryActions";

export default async function HomePage() {
  const [propertyRes, categoryRes] = await Promise.all([
    propertyAction().catch(() => null),
    getCategoriesAction().catch(() => null),
  ]);

  const properties = Array.isArray(propertyRes?.data) ? propertyRes.data : [];
  const rawCategories = Array.isArray(categoryRes?.data)
    ? categoryRes.data
    : Array.isArray((categoryRes?.data as any)?.data)
    ? (categoryRes?.data as any).data
    : [];

  return (
    <div className="flex flex-col space-y-0">
      {/* 1. Hero + Search */}
      <HomeHero />

      {/* 2. Browse by Category */}
      <CategoryBrowseSection categories={rawCategories} />

      {/* 3. Featured Properties Carousel */}
      <PropertyCarouselSection properties={properties} />

      {/* 4. How RentNest Works */}
      <HowItWorksSection />

      {/* 5. Why Choose RentNest */}
      <HomeAwaySection />

      {/* 6. Popular Locations */}
      <PopularLocationsSection properties={properties} />

      {/* 7. Platform Statistics */}
      <PropertyStatsSection totalProperties={properties.length} />

      {/* 8. Testimonials & Reviews */}
      <ReviewsSection />

      {/* 9. Frequently Asked Questions */}
      <HomeFaqSection />

      {/* 10. Final Call to Action */}
      <FinalCtaSection />
    </div>
  );
}
