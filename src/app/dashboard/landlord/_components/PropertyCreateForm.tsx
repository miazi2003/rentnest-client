"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "sonner";
import {
  Building2,
  DollarSign,
  MapPin,
  Tag,
  Image as ImageIcon,
  FileText,
  Plus,
  Trash2,
  Loader2,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { TCreatePropertyPayload, ICategory } from "../types/landlord.types";
import { createPropertyAction } from "@/app/features/landlord/actions/createPropertyAction";
import { getCategoriesAction } from "@/app/features/landlord/actions/getCategoriesAction";

interface PropertyCreateFormProps {
  categories?: ICategory[];
  onSuccess?: () => void;
}

export function PropertyCreateForm({
  categories = [],
  onSuccess,
}: PropertyCreateFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categoryList, setCategoryList] = useState<ICategory[]>(categories);
  const [fetchingCategories, setFetchingCategories] = useState(false);

  const [formData, setFormData] = useState<TCreatePropertyPayload>({
    title: "",
    description: "",
    price: 0,
    address: "",
    latitude: 23.8103,
    longitude: 90.4125,
    images: [],
    categoryId: categories[0]?.id || "",
    availability: "AVAILABLE",
  });

  useEffect(() => {
    async function loadCategories() {
      if (categories && categories.length > 0) {
        setCategoryList(categories);
        setFormData((prev) => ({
          ...prev,
          categoryId: prev.categoryId || categories[0].id,
        }));
        return;
      }

      try {
        setFetchingCategories(true);
        let data = await getCategoriesAction();

        if (!data || data.length === 0) {
          try {
            const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
            if (!backendUrl) throw new Error("NEXT_PUBLIC_BACKEND_URL is not configured");
            const res = await fetch(`${backendUrl}/api/categories`);
            if (res.ok) {
              const json = await res.json();
              data = Array.isArray(json)
                ? json
                : Array.isArray(json?.data)
                ? json.data
                : Array.isArray(json?.categories)
                ? json.categories
                : [];
            }
          } catch (fetchErr) {
            console.error("Direct fetch categories error:", fetchErr);
          }
        }

        if (data && data.length > 0) {
          setCategoryList(data);
          setFormData((prev) => ({
            ...prev,
            categoryId: prev.categoryId || data[0].id,
          }));
        }
      } catch (err) {
        console.error("Failed to load categories:", err);
      } finally {
        setFetchingCategories(false);
      }
    }

    loadCategories();
  }, [categories]);

  const [imageUrlInput, setImageUrlInput] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  const handleAddImage = () => {
    if (!imageUrlInput.trim()) return;
    try {
      new URL(imageUrlInput.trim());
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, imageUrlInput.trim()],
      }));
      setImageUrlInput("");
      toast.success("Image URL added to list");
    } catch {
      toast.error("Please enter a valid image URL (e.g. https://example.com/image.jpg)");
    }
  };

  const handleRemoveImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error("Please enter a property title");
      return;
    }
    if (!formData.address.trim()) {
      toast.error("Please enter property address");
      return;
    }
    if (formData.price <= 0) {
      toast.error("Please enter a valid rental price greater than 0");
      return;
    }
    if (!formData.categoryId) {
      toast.error("Please select a property category");
      return;
    }

    try {
      setLoading(true);
      const res = await createPropertyAction(formData);

      if (res?.ok) {
        toast.success("Property created successfully!");
        if (onSuccess) {
          onSuccess();
        } else {
          router.push("/dashboard/landlord/properties");
          router.refresh();
        }
      } else {
        toast.error(res?.message || res?.data?.message || "Failed to create property.");
      }
    } catch {
      toast.error("An unexpected error occurred while creating property.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="mx-auto max-w-4xl gap-0 overflow-hidden rounded-[2rem] border-0 bg-card py-0 shadow-sm shadow-slate-900/5 ring-0 dark:shadow-black/10">

      <div className="relative overflow-hidden bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-700 p-6 text-white sm:p-9">
        <div className="pointer-events-none absolute -right-16 -top-20 size-56 rounded-full bg-white/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 left-1/3 size-48 rounded-full bg-teal-300/20 blur-3xl" />
        <div className="relative flex items-center justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
              Create New Property
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100/90">
              List your rental property on RentNest to attract verified tenants.
            </p>
          </div>
          <Button
            type="button"
            variant="ghost"
            onClick={() => router.back()}
            className="text-white hover:bg-white/20 rounded-2xl hidden sm:flex items-center gap-1.5 text-xs font-bold"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
        </div>
      </div>

      <CardContent className="bg-muted/20 p-4 sm:p-7 lg:p-8">
        <form onSubmit={handleSubmit} className="space-y-8">

          <div className="space-y-5 rounded-3xl bg-card p-5 sm:p-6">
            <div className="flex items-center gap-3">
              <Building2 className="size-9 shrink-0 rounded-xl bg-emerald-500/10 p-2 text-emerald-600 dark:text-emerald-400" />
              <h3 className="text-base font-extrabold text-foreground">
                Basic Information
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              <div className="sm:col-span-2 space-y-1.5">
                <label htmlFor="property-title" className="text-xs font-bold text-foreground flex items-center gap-1">
                  Property Title <span className="text-rose-500">*</span>
                </label>
                <Input
                  id="property-title"
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. Modern 3-Bedroom Apartment in Gulshan"
                  required
                  className="h-12 rounded-2xl border-0 bg-background px-4 text-sm shadow-[inset_0_0_0_1px_rgba(148,163,184,0.12)] transition-all focus-visible:ring-2 focus-visible:ring-emerald-500/50"
                />
              </div>


              <div className="space-y-1.5">
                <label htmlFor="property-price" className="text-xs font-bold text-foreground flex items-center gap-1">
                  Rent Price per Day ($) <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <DollarSign className="w-4 h-4 text-muted-foreground absolute left-3.5 top-3.5" />
                  <Input
                    id="property-price"
                  type="number"
                    name="price"
                    value={formData.price || ""}
                    onChange={handleChange}
                    placeholder="2500"
                    min="1"
                    required
                    className="h-12 rounded-2xl border-0 bg-background pl-10 text-sm shadow-[inset_0_0_0_1px_rgba(148,163,184,0.12)] transition-all focus-visible:ring-2 focus-visible:ring-emerald-500/50"
                  />
                </div>
              </div>


              <div className="space-y-1.5">
                <label htmlFor="property-category" className="text-xs font-bold text-foreground flex items-center gap-1">
                  Property Category <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Tag className="w-4 h-4 text-muted-foreground absolute left-3.5 top-3.5" />
                  <select
                    id="property-category"
                  name="categoryId"
                    value={formData.categoryId}
                    onChange={handleChange}
                    disabled={fetchingCategories}
                    className="h-12 w-full cursor-pointer rounded-2xl border-0 bg-background pl-10 pr-4 text-sm font-medium text-foreground shadow-[inset_0_0_0_1px_rgba(148,163,184,0.12)] outline-none transition-all focus:ring-2 focus:ring-emerald-500/50"
                  >
                    {categoryList.length === 0 ? (
                      <option value="">
                        {fetchingCategories ? "Loading categories..." : "Select property category..."}
                      </option>
                    ) : (
                      categoryList.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))
                    )}
                  </select>
                </div>
              </div>
            </div>
          </div>


          <div className="space-y-5 rounded-3xl bg-card p-5 sm:p-6">
            <div className="flex items-center gap-3">
              <MapPin className="size-9 shrink-0 rounded-xl bg-emerald-500/10 p-2 text-emerald-600 dark:text-emerald-400" />
              <h3 className="text-base font-extrabold text-foreground">
                Location Details
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

              <div className="sm:col-span-3 space-y-1.5">
                <label htmlFor="property-address" className="text-xs font-bold text-foreground flex items-center gap-1">
                  Full Address / Location <span className="text-rose-500">*</span>
                </label>
                <Input
                  id="property-address"
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="e.g. House 42, Road 11, Banani, Dhaka"
                  required
                  className="h-12 rounded-2xl border-0 bg-background px-4 text-sm shadow-[inset_0_0_0_1px_rgba(148,163,184,0.12)] transition-all focus-visible:ring-2 focus-visible:ring-emerald-500/50"
                />
              </div>


              <div className="space-y-1.5">
                <label htmlFor="property-latitude" className="text-xs font-bold text-foreground">
                  Latitude (Optional)
                </label>
                <Input
                  type="number"
                  step="any"
                  name="latitude"
                  value={formData.latitude}
                  onChange={handleChange}
                  placeholder="23.8103"
                  className="h-12 rounded-2xl border-0 bg-background px-4 text-sm shadow-[inset_0_0_0_1px_rgba(148,163,184,0.12)] focus-visible:ring-2 focus-visible:ring-emerald-500/50"
                />
              </div>


              <div className="space-y-1.5">
                <label htmlFor="property-longitude" className="text-xs font-bold text-foreground">
                  Longitude (Optional)
                </label>
                <Input
                  type="number"
                  step="any"
                  name="longitude"
                  value={formData.longitude}
                  onChange={handleChange}
                  placeholder="90.4125"
                  className="h-12 rounded-2xl border-0 bg-background px-4 text-sm shadow-[inset_0_0_0_1px_rgba(148,163,184,0.12)] focus-visible:ring-2 focus-visible:ring-emerald-500/50"
                />
              </div>
            </div>
          </div>


          <div className="space-y-5 rounded-3xl bg-card p-5 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ImageIcon className="size-9 shrink-0 rounded-xl bg-emerald-500/10 p-2 text-emerald-600 dark:text-emerald-400" />
                <h3 className="text-base font-extrabold text-foreground">
                  Property Images
                </h3>
              </div>
              <span className="text-xs text-muted-foreground font-semibold">
                {formData.images.length} added
              </span>
            </div>

            <div className="space-y-3">
              <div className="flex gap-2">
                <Input
                  id="property-image-url"
                  aria-label="Property image URL"
                  type="url"
                  value={imageUrlInput}
                  onChange={(e) => setImageUrlInput(e.target.value)}
                  placeholder="Paste image URL (e.g. https://images.unsplash.com/...)"
                  className="h-12 flex-1 rounded-2xl border-0 bg-background px-4 text-sm shadow-[inset_0_0_0_1px_rgba(148,163,184,0.12)] focus-visible:ring-2 focus-visible:ring-emerald-500/50"
                />
                <Button
                  type="button"
                  onClick={handleAddImage}
                  className="h-12 shrink-0 cursor-pointer gap-1.5 rounded-2xl bg-emerald-600 px-5 text-xs font-bold text-white transition-colors hover:bg-emerald-700"
                >
                  <Plus className="w-4 h-4" />
                  Add URL
                </Button>
              </div>


              {formData.images.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                  {formData.images.map((img, idx) => (
                    <div
                      key={idx}
                      className="group relative h-24 overflow-hidden rounded-2xl bg-muted"
                    >
                      <Image
                        src={img}
                        alt={`Property image ${idx + 1}`}
                        fill
                        unoptimized
                        sizes="(max-width: 640px) 50vw, 25vw"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(idx)}
                        aria-label={`Remove property image ${idx + 1}`}
                        className="absolute top-1.5 right-1.5 p-1.5 rounded-full bg-rose-600/90 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-rose-700 cursor-pointer"
                        title="Remove image"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>


          <div className="space-y-5 rounded-3xl bg-card p-5 sm:p-6">
            <div className="flex items-center gap-3">
              <FileText className="size-9 shrink-0 rounded-xl bg-emerald-500/10 p-2 text-emerald-600 dark:text-emerald-400" />
              <h3 className="text-base font-extrabold text-foreground">
                Property Description
              </h3>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="property-description" className="text-xs font-bold text-foreground">
                  Description & Amenities
              </label>
              <textarea
                id="property-description"
                  name="description"
                rows={4}
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe key features, rooms, amenities, neighborhood highlights..."
                className="w-full resize-none rounded-2xl border-0 bg-background p-4 text-sm font-medium text-foreground shadow-[inset_0_0_0_1px_rgba(148,163,184,0.12)] outline-none transition-all placeholder:text-muted-foreground focus:ring-2 focus:ring-emerald-500/50"
              />
            </div>
          </div>


          <div className="flex flex-col-reverse justify-end gap-3 rounded-3xl bg-card p-4 sm:flex-row">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              className="rounded-2xl border-0 bg-muted px-6 py-3 text-xs font-bold transition-colors hover:bg-muted/80"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={loading}
              className="cursor-pointer gap-2 rounded-2xl bg-emerald-600 px-8 py-3 text-xs font-bold text-white transition-colors hover:bg-emerald-700 active:scale-95"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creating Property...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  Create Property Listing
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}



