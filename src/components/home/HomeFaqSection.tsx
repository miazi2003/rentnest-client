"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

export function HomeFaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "How do I submit a rental request on RentNest?",
      answer:
        "Select your desired property on the Explore page, click 'Request Rental', choose your lease start and end dates, and submit your application. The landlord will review your request directly in their portal.",
    },
    {
      question: "Are rental payments processed securely?",
      answer:
        "Yes! RentNest integrates directly with Stripe Hosted Checkout. Once a landlord approves your rental request, you can pay your rent securely using any major credit card or digital payment option.",
    },
    {
      question: "Can I edit or cancel my rental request?",
      answer:
        "You can view all active and past rental requests in your Tenant Dashboard. If a request is still pending landlord approval, you can track its status live.",
    },
    {
      question: "How do landlords list properties on RentNest?",
      answer:
        "Landlords can sign up for a Landlord account and access their Landlord Dashboard to add, update, and manage property listings, set availability, and review tenant applications.",
    },
    {
      question: "Can I leave property reviews?",
      answer:
        "Yes, tenants with active or completed rental requests can leave ratings and detailed reviews for properties directly through their dashboard.",
    },
  ];

  return (
    <section className="py-16 sm:py-24 bg-background border-t border-border/50">
      <div className="mx-auto max-w-4xl px-5 sm:px-8 space-y-12">
        <div className="text-center space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <HelpCircle className="size-3.5" /> Got Questions?
          </span>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-foreground font-heading">
            Frequently Asked Questions
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            Everything you need to know about renting and listing with RentNest.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="rounded-2xl border border-border bg-card overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 font-bold text-base sm:text-lg text-foreground hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <span>{faq.question}</span>
                  <ChevronDown
                    className={`size-5 shrink-0 text-muted-foreground transition-transform duration-300 ${
                      isOpen ? "rotate-180 text-emerald-600" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-6 sm:px-6 text-sm text-muted-foreground leading-relaxed border-t border-border/40 pt-4">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
