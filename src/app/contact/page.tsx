"use client";

import { useState, useTransition } from "react";
import { Mail, Phone, MapPin, Send, Building2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { contactAction } from "@/app/features/contact/actions/contactAction";
import type { ContactActionState } from "@/app/features/contact/types";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<ContactActionState | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);
    startTransition(async () => {
      const result = await contactAction(formData);
      setFeedback(result);
      if (!result.success) {
        toast.error(result.message);
        return;
      }

      toast.success(result.message);
      setFormData({ name: "", email: "", subject: "", message: "" });
    });
  };

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
          <Building2 className="size-3.5" /> RentNest Support & Inquiry
        </span>
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-foreground font-heading">
          Get in Touch
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
          Have questions about listing your property, making rental payments, or finding your next home? Our support team is here to assist you.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Contact Info */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="rounded-3xl border-border bg-card shadow-sm p-2 sm:p-4">
            <CardHeader>
              <CardTitle className="text-xl font-bold">Contact Information</CardTitle>
              <CardDescription className="text-xs">
                Reach out to us directly through any of our channels below.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="flex items-start gap-4 p-3.5 rounded-2xl bg-muted/40 border border-border/50">
                <div className="size-10 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                  <Mail className="size-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Email Us</h4>
                  <p className="text-sm font-semibold text-foreground mt-0.5">support@rentnest.com</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">Response within 24 hours</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-3.5 rounded-2xl bg-muted/40 border border-border/50">
                <div className="size-10 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                  <Phone className="size-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Call Us</h4>
                  <p className="text-sm font-semibold text-foreground mt-0.5">+1 (800) 555-NEST</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">Mon - Fri, 9am - 6pm EST</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-3.5 rounded-2xl bg-muted/40 border border-border/50">
                <div className="size-10 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                  <MapPin className="size-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Office HQ</h4>
                  <p className="text-sm font-semibold text-foreground mt-0.5">100 Rental Plaza, Suite 400</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">New York, NY 10001</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-emerald-500/20 bg-gradient-to-br from-emerald-950/90 to-slate-950 text-white p-6 shadow-xl">
            <h3 className="text-lg font-bold text-emerald-300">Are you a Landlord?</h3>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              List your properties easily, review tenant requests, and receive verified rental payments directly through RentNest.
            </p>
          </Card>
        </div>

        {/* Form */}
        <div className="lg:col-span-7">
          <Card className="rounded-3xl border-border bg-card shadow-sm p-4 sm:p-6">
            <CardHeader className="px-2">
              <CardTitle className="text-2xl font-bold">Send us a Message</CardTitle>
              <CardDescription className="text-xs">
                Fill out the form below and our team will get back to you promptly.
              </CardDescription>
            </CardHeader>
            <CardContent className="px-2 pt-2">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label htmlFor="contact-name" className="text-xs font-semibold text-foreground">
                        Your Name <span className="text-rose-500">*</span>
                      </label>
                      <Input
                        id="contact-name"
                        type="text"
                        placeholder="John Doe"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="rounded-xl"
                        aria-describedby={feedback?.errors?.name ? "contact-name-error" : undefined}
                      />
                      {feedback?.errors?.name && <p id="contact-name-error" className="text-xs text-rose-600 dark:text-rose-400">{feedback.errors.name}</p>}
                    </div>
                    <div className="space-y-1.5">
                      <label htmlFor="contact-email" className="text-xs font-semibold text-foreground">
                        Email Address <span className="text-rose-500">*</span>
                      </label>
                      <Input
                        id="contact-email"
                        type="email"
                        placeholder="john@example.com"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="rounded-xl"
                        aria-describedby={feedback?.errors?.email ? "contact-email-error" : undefined}
                      />
                      {feedback?.errors?.email && <p id="contact-email-error" className="text-xs text-rose-600 dark:text-rose-400">{feedback.errors.email}</p>}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="contact-subject" className="text-xs font-semibold text-foreground">
                      Subject
                    </label>
                    <Input
                      id="contact-subject"
                      type="text"
                      placeholder="Property Inquiry / Support / General Question"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="rounded-xl"
                      aria-describedby={feedback?.errors?.subject ? "contact-subject-error" : undefined}
                    />
                    {feedback?.errors?.subject && <p id="contact-subject-error" className="text-xs text-rose-600 dark:text-rose-400">{feedback.errors.subject}</p>}
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="contact-message" className="text-xs font-semibold text-foreground">
                      Message <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      id="contact-message"
                      rows={5}
                      required
                      placeholder="How can we help you today?"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full rounded-xl border border-input bg-transparent px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                      aria-describedby={feedback?.errors?.message ? "contact-message-error" : undefined}
                    />
                    {feedback?.errors?.message && <p id="contact-message-error" className="text-xs text-rose-600 dark:text-rose-400">{feedback.errors.message}</p>}
                  </div>

                  {feedback?.message && (
                    <p className={`text-xs font-semibold ${feedback.success ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`} role="status">
                      {feedback.message}
                    </p>
                  )}

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-700 text-white py-3 shadow-md shadow-emerald-600/25 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isSubmitting ? (
                      "Sending message..."
                    ) : (
                      <>
                        Send Message <Send className="size-3.5" />
                      </>
                    )}
                  </Button>
                </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
