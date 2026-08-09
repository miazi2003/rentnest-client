import Image from "next/image";
import { Quote } from "lucide-react";

export function ReviewsSection() {
  return (
    <section className="overflow-hidden bg-[#007a55] py-16 text-white sm:py-20 lg:py-28">
      <div className="mx-auto grid w-full max-w-[1600px] gap-12 px-5 sm:px-8 lg:grid-cols-[0.7fr_1.5fr] lg:items-center lg:gap-16 lg:px-12">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-emerald-300">Resident stories</p>
          <h2 className="mt-5 max-w-lg font-heading text-[clamp(3.2rem,6vw,6.5rem)] font-black leading-[0.88] tracking-[-0.07em]">Verified renter feedback</h2>
          <p className="mt-7 max-w-sm text-sm leading-6 text-emerald-50/65">Verified tenant reviews will appear here as completed RentNest stays receive feedback.</p>
        </div>

        <figure className="relative min-h-[310px] overflow-hidden rounded-[1.75rem] bg-emerald-900">
          <Image src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1000&q=88" alt="RentNest residents spending time together" fill sizes="(max-width: 1280px) 70vw, 50vw" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/70 to-transparent" />
          <figcaption className="absolute bottom-6 left-6 right-6 flex items-start gap-3 text-sm font-bold"><Quote className="size-5 shrink-0 text-emerald-300" /> Homes are better when the rental journey feels human.</figcaption>
        </figure>
      </div>
    </section>
  );
}
