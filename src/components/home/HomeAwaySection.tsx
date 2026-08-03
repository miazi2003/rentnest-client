import Image from "next/image";

const retreatImages = [
  {
    src: "https://images.unsplash.com/photo-1533669955142-6a73332af4db?auto=format&fit=crop&w=900&q=88",
    alt: "Tropical villa surrounded by lush greenery",
    position: "object-center",
  },
  {
    src: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=900&q=88",
    alt: "Warm and peaceful natural living room",
    position: "object-center",
  },
  {
    src: "https://images.unsplash.com/photo-1573843981267-be1999ff37cd?auto=format&fit=crop&w=900&q=88",
    alt: "Private villa pool in a tropical setting",
    position: "object-center",
  },
] as const;

export function HomeAwaySection() {
  return (
    <section className="bg-[#f1f0e8] py-16 text-slate-950 sm:py-20 lg:py-28">
      <div className="mx-auto grid w-full max-w-[1600px] gap-12 px-5 sm:px-8 lg:grid-cols-[0.82fr_1.6fr] lg:items-center lg:gap-16 lg:px-12">
        <div className="max-w-md lg:self-stretch lg:py-2">
          <p className="max-w-xs text-[11px] font-medium leading-[1.55] text-slate-600 sm:text-xs">
            Escape to a serene retreat nestled in nature, where thoughtful
            design meets modern comfort. Book now for an authentic home
            experience in a beautifully calm setting.
          </p>

          <h2 className="mt-8 font-heading text-[clamp(2.65rem,5.2vw,5.25rem)] font-black leading-[0.88] tracking-[-0.07em]">
            A Peaceful
            <span className="block">Home Away</span>
            <span className="block">From Home</span>
          </h2>
        </div>

        <div className="-mx-5 overflow-x-auto px-5 [scrollbar-width:none] sm:-mx-8 sm:px-8 lg:mx-0 lg:overflow-visible lg:px-0 [&::-webkit-scrollbar]:hidden">
          <div className="grid min-w-[720px] grid-cols-[1.02fr_1.02fr_0.76fr] gap-3 sm:gap-4 lg:min-w-0">
            {retreatImages.map(({ src, alt, position }, index) => (
              <figure
                key={src}
                className={`relative overflow-hidden rounded-[2rem] bg-stone-200 ${
                  index === 2 ? "translate-y-7" : index === 1 ? "-translate-y-3" : "translate-y-1"
                } aspect-[0.72] sm:rounded-[2.5rem] lg:aspect-[0.76]`}
              >
                <Image
                  src={src}
                  alt={alt}
                  fill
                  sizes="(max-width: 1024px) 280px, 25vw"
                  className={`object-cover ${position} transition-transform duration-700 hover:scale-[1.035]`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/15 via-transparent to-white/5" />
              </figure>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
