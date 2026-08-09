import { Search, Calendar, ShieldCheck, Key } from "lucide-react";

export function HowItWorksSection() {
  const steps = [
    {
      icon: Search,
      step: "01",
      title: "Discover Verified Homes",
      description: "Filter listings by location, price, and category. View full property details and amenity specifications.",
    },
    {
      icon: Calendar,
      step: "02",
      title: "Submit Rental Request",
      description: "Select your desired move-in and lease dates, then submit a rental request directly to the landlord.",
    },
    {
      icon: ShieldCheck,
      step: "03",
      title: "Secure Stripe Payment",
      description: "Once approved by the landlord, complete your payment securely with Stripe integration.",
    },
    {
      icon: Key,
      step: "04",
      title: "Move In & Track Status",
      description: "Track payment receipts, rental request updates, and leave property reviews in your tenant portal.",
    },
  ];

  return (
    <section className="py-16 sm:py-24 bg-background">
      <div className="mx-auto max-w-[1600px] px-5 sm:px-8 lg:px-12 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            Simple Process
          </span>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-foreground font-heading">
            How RentNest Works
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            A seamless digital rental journey from discovery to key handover.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {steps.map(({ icon: Icon, step, title, description }) => (
            <div
              key={step}
              className="relative p-6 sm:p-8 rounded-3xl border border-border bg-card shadow-xs flex flex-col justify-between space-y-6 hover:border-emerald-500/40 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="size-12 rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <Icon className="size-6" />
                </div>
                <span className="text-2xl font-black text-muted-foreground/30 font-heading">
                  {step}
                </span>
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-foreground">{title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
