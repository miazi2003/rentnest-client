import Image from "next/image";
import { Quote, Star } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const reviews = [
  {
    name: "Lillian Patrick",
    role: "Tenant",
    rating: "4.9",
    quote: "The entire process felt clear and personal. I found a beautiful home that matched both my needs and my budget.",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=160&q=85",
  },
  {
    name: "Osvaldo Winters",
    role: "Landlord",
    rating: "4.9",
    quote: "RentNest made it remarkably simple to showcase my property and connect with a thoughtful, reliable tenant.",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=160&q=85",
  },
  {
    name: "Brady Hinton",
    role: "Tenant",
    rating: "5.0",
    quote: "The listings were honest, the details were useful, and arranging everything took far less time than I expected.",
    avatar: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=160&q=85",
  },
  {
    name: "Maya Thompson",
    role: "Tenant",
    rating: "4.8",
    quote: "I felt supported from the first viewing through move-in day. It was the calmest rental experience I have ever had.",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=85",
  },
] as const;

export function ReviewsSection() {
  return (
    <section className="overflow-hidden bg-[#007a55] py-16 text-white sm:py-20 lg:py-28">
      <Carousel opts={{ align: "start", loop: true }} className="mx-auto grid w-full max-w-[1600px] gap-12 px-5 sm:px-8 lg:grid-cols-[0.7fr_1.5fr] lg:items-center lg:gap-16 lg:px-12">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-emerald-300">Resident stories</p>
          <h2 className="mt-5 max-w-lg font-heading text-[clamp(3.2rem,6vw,6.5rem)] font-black leading-[0.88] tracking-[-0.07em]">
            What our happy renters say
          </h2>
          <p className="mt-7 max-w-sm text-sm leading-6 text-emerald-50/65">
            Genuine feedback from people who trusted RentNest to make finding
            or listing a home feel refreshingly straightforward.
          </p>

          <div className="mt-8 flex items-center gap-4">
            <div className="flex -space-x-2">
              {reviews.slice(0, 3).map((review) => (
                <div key={review.name} className="relative size-9 overflow-hidden rounded-full border-2 border-emerald-950 bg-emerald-900">
                  <Image src={review.avatar} alt="" fill sizes="36px" className="object-cover" />
                </div>
              ))}
              <span className="relative flex size-9 items-center justify-center rounded-full border-2 border-emerald-950 bg-emerald-400 text-[9px] font-black text-emerald-950">2k+</span>
            </div>
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-emerald-100/60">Growing community</p>
          </div>
        </div>

        <div className="min-w-0">
          <CarouselContent className="-ml-4">
            {reviews.map((review) => (
              <CarouselItem key={review.name} className="basis-[88%] pl-4 sm:basis-[55%] xl:basis-1/2">
                <article className="flex min-h-[310px] flex-col rounded-[1.75rem] bg-[#f4f0e7] p-6 text-emerald-950 sm:p-8">
                  <Quote className="size-7 fill-emerald-700 text-emerald-700" />
                  <p className="mt-7 text-base leading-7 text-emerald-950/75">{review.quote}</p>
                  <div className="mt-auto flex items-center gap-3 pt-9">
                    <div className="relative size-11 shrink-0 overflow-hidden rounded-full bg-emerald-100">
                      <Image src={review.avatar} alt={review.name} fill sizes="44px" className="object-cover" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="truncate text-sm font-extrabold">{review.name}</h3>
                      <div className="mt-1 flex items-center gap-1.5 text-[10px] font-bold text-emerald-800/65">
                        <span>{review.role}</span>
                        <span>•</span>
                        <Star className="size-3 fill-orange-500 text-orange-500" />
                        <span>{review.rating}/5</span>
                      </div>
                    </div>
                  </div>
                </article>
              </CarouselItem>
            ))}

            <CarouselItem className="basis-[88%] pl-4 sm:basis-[55%] xl:basis-1/2">
              <figure className="relative min-h-[310px] overflow-hidden rounded-[1.75rem] bg-emerald-900">
                <Image src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1000&q=88" alt="Happy RentNest residents spending time together" fill sizes="(max-width: 1280px) 70vw, 32vw" className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/60 to-transparent" />
                <figcaption className="absolute bottom-6 left-6 right-6 text-sm font-bold">Homes are better when the journey feels human.</figcaption>
              </figure>
            </CarouselItem>
          </CarouselContent>

          <div className="mt-6 flex justify-end gap-2">
            <CarouselPrevious className="static inset-auto size-11 translate-x-0 border-white/20 bg-transparent text-white hover:bg-white hover:text-emerald-950" />
            <CarouselNext className="static inset-auto size-11 translate-x-0 border-white/40 bg-transparent text-white hover:bg-white hover:text-emerald-950" />
          </div>
        </div>
      </Carousel>
    </section>
  );
}
