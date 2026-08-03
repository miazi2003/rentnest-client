import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { PropertyCard } from "@/app/properties/components/PropertyCard";
import type { PropertyItem } from "@/app/properties/components/property.types";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface PropertyCarouselSectionProps {
  properties: PropertyItem[];
}

export function PropertyCarouselSection({ properties }: PropertyCarouselSectionProps) {
  if (properties.length === 0) return null;

  return (
    <section className="overflow-hidden bg-background py-16 sm:py-20 lg:py-28">
      <Carousel opts={{ align: "start", loop: properties.length > 3 }} className="mx-auto w-full max-w-[1600px] px-5 sm:px-8 lg:px-12">
        <div className="mb-10 flex items-end justify-between gap-6 sm:mb-12">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-emerald-600 dark:text-emerald-400">
              Handpicked for you
            </p>
            <h2 className="mt-3 font-heading text-4xl font-black leading-none tracking-[-0.06em] sm:text-5xl lg:text-6xl">
              Places worth
              <span className="block text-muted-foreground">coming home to.</span>
            </h2>
          </div>

          <div className="hidden shrink-0 items-center gap-2 sm:flex">
            <CarouselPrevious className="static inset-auto size-11 translate-x-0 border-border bg-background text-foreground hover:bg-foreground hover:text-background" />
            <CarouselNext className="static inset-auto size-11 translate-x-0 border-border bg-background text-foreground hover:bg-foreground hover:text-background" />
          </div>
        </div>

        <CarouselContent className="-ml-5">
          {properties.slice(0, 9).map((property) => (
            <CarouselItem key={property.id} className="basis-[92%] pl-5 sm:basis-[68%] md:basis-[52%] lg:basis-[38%] xl:basis-1/3">
              <PropertyCard property={property} />
            </CarouselItem>
          ))}
        </CarouselContent>

        <div className="mt-8 flex items-center justify-between sm:justify-end">
          <div className="flex items-center gap-2 sm:hidden">
            <CarouselPrevious className="static inset-auto size-11 translate-x-0" />
            <CarouselNext className="static inset-auto size-11 translate-x-0" />
          </div>
          <Link href="/properties" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-emerald-700 transition-colors hover:text-emerald-500 dark:text-emerald-300">
            View all properties <ArrowUpRight className="size-4" />
          </Link>
        </div>
      </Carousel>
    </section>
  );
}
