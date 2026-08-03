"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
  Sparkles,
  Edit3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { TCreatePropertyPayload, ICategory, ILandlordProperty } from "../types/landlord.types";
import { updatePropertyAction } from "@/app/features/landlord/actions/updatePropertyAction";
import { getCategoriesAction } from "@/app/features/landlord/actions/getCategoriesAction";
import { getPropertyByIdAction } from "@/app/features/property/actions/getPropertyByIdAction";

interface PropertyEditFormProps {
  propertyId: string;
  initialData?: ILandlordProperty;
  categories?: ICategory[];
  onSuccess?: () => void;
}

export function PropertyEditForm({
  propertyId,
  initialData,
  categories = [],
  onSuccess,
}: PropertyEditFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetchingProperty, setFetchingProperty] = useState(!initialData);
  const [categoryList, setCategoryList] = useState<ICategory[]>(categories);
  const [fetchingCategories, setFetchingCategories] = useState(false);

  // Form State
  const [formData, setFormData] = useState<TCreatePropertyPayload>({
    title: initialData?.title || "",
    description: initialData?.description || "",
    price: Number(initialData?.price || 0),
    address: initialData?.address || (initialData as any)?.location || "",
    latitude: initialData?.latitude || 23.8103,
    longitude: initialData?.longitude || 90.4125,
    images: initialData?.images || [],
    categoryId: initialData?.categoryId || initialData?.category?.id || "",
    availability: initialData?.availability || "AVAILABLE",
  });

  const [imageUrlInput, setImageUrlInput] = useState("");

  // Fetch initial property data if not provided as prop
  useEffect(() => {
    async function loadProperty() {
      if (initialData) return;
      try {
        setFetchingProperty(true);
        const res = await getPropertyByIdAction(propertyId);
        if (res.ok && res.data) {
          const prop = res.data;
          setFormData({
            title: prop.title || "",
            description: prop.description || "",
            price: Number(prop.price || 0),
            address: prop.address || prop.location || "",
            latitude: prop.latitude || 23.8103,
            longitude: prop.longitude || 90.4125,
            images: Array.isArray(prop.images) ? prop.images : [],
            categoryId: prop.categoryId || prop.category?.id || "",
            availability: prop.availability || "AVAILABLE",
          });
        } else {
          toast.error("Failed to load property details for editing.");
        }
      } catch (err) {
        console.error("Failed to load property details:", err);
      } finally {
        setFetchingProperty(false);
      }
    }
    loadProperty();
  }, [propertyId, initialData]);

  // Load categories
  useEffect(() => {
    async function loadCategories() {
      if (categories && categories.length > 0) {
        setCategoryList(categories);
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
          if (!formData.categoryId) {
            setFormData((prev) => ({ ...prev, categoryId: data[0].id }));
          }
        }
      } catch (err) {
        console.error("Failed to load categories:", err);
      } finally {
        setFetchingCategories(false);
      }
    }

    loadCategories();
  }, [categories]);

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
      const res = await updatePropertyAction(propertyId, formData);

      if (res?.ok) {
        toast.success("Property updated successfully!");
        if (onSuccess) {
          onSuccess();
        } else {
          router.push("/dashboard/landlord/properties");
          router.refresh();
        }
      } else {
        toast.error(res?.message || res?.data?.message || "Failed to update property.");
      }
    } catch (error) {
      toast.error("An unexpected error occurred while updating property.");
    } finally {
      setLoading(false);
    }
  };

  if (fetchingProperty) {
    return (
      <Card className="max-w-4xl mx-auto rounded-3xl border border-border shadow-xl p-12 text-center space-y-4">
        <Loader2 className="w-10 h-10 animate-spin text-emerald-600 mx-auto" />
        <p className="text-sm font-bold text-foreground">Loading property details...</p>
      </Card>
    );
  }

  return (
    <Card className="max-w-4xl mx-auto rounded-3xl border border-border shadow-xl overflow-hidden bg-card">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 p-6 sm:p-8 text-white relative">
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-bold tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              Edit Property Listing
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
              Update Property
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100/90">
              Update your rental property listing details and pricing.
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

      <CardContent className="p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Section 1: Basic Information */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-border pb-2">
              <Building2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <h3 className="text-base font-extrabold text-foreground">
                Basic Information
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Title */}
              <div className="sm:col-span-2 space-y-1.5">
                <label className="text-xs font-bold text-foreground flex items-center gap-1">
                  Property Title <span className="text-rose-500">*</span>
                </label>
                <Input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. Modern 3-Bedroom Apartment in Gulshan"
                  required
                  className="rounded-2xl text-xs h-11 border-border focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Price */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground flex items-center gap-1">
                  Rent Price per Day ($) <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <DollarSign className="w-4 h-4 text-muted-foreground absolute left-3.5 top-3.5" />
                  <Input
                    type="number"
                    name="price"
                    value={formData.price || ""}
                    onChange={handleChange}
                    placeholder="2500"
                    min="1"
                    required
                    className="rounded-2xl text-xs h-11 pl-9 border-border focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Category */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground flex items-center gap-1">
                  Property Category <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Tag className="w-4 h-4 text-muted-foreground absolute left-3.5 top-3.5" />
                  <select
                    name="categoryId"
                    value={formData.categoryId}
                    onChange={handleChange}
                    disabled={fetchingCategories}
                    className="w-full h-11 rounded-2xl border border-border bg-background pl-9 pr-4 text-xs font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all cursor-pointer"
                  >
                    {categoryList.length === 0 ? (
                      <option value="">
                        {fetchingCategories ? "Loading categories..." : "Select category..."}
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

              {/* Availability Toggle */}
              <div className="sm:col-span-2 space-y-2 pt-2">
                <div className="flex items-center justify-between p-4 rounded-2xl border border-border bg-muted/20">
                  <div className="space-y-0.5">
                    <label className="text-xs font-bold text-foreground block flex items-center gap-2">
                      <span>Listing Availability</span>
                      <span
                        className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                          formData.availability === "AVAILABLE"
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                            : "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20"
                        }`}
                      >
                        {formData.availability === "AVAILABLE" ? "AVAILABLE" : "UNAVAILABLE"}
                      </span>
                    </label>
                    <p className="text-xs text-muted-foreground">
                      {formData.availability === "AVAILABLE"
                        ? "Property is AVAILABLE for tenants to submit rental requests."
                        : "Property is UNAVAILABLE. New rental requests will be disabled."}
                    </p>
                  </div>

                  <button
                    type="button"
                    role="switch"
                    aria-checked={formData.availability === "AVAILABLE"}
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        availability:
                          prev.availability === "AVAILABLE" ? "UNAVAILABLE" : "AVAILABLE",
                      }))
                    }
                    className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 ${
                      formData.availability === "AVAILABLE"
                        ? "bg-emerald-600"
                        : "bg-slate-300 dark:bg-slate-700"
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                        formData.availability === "AVAILABLE" ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Location Details */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-border pb-2">
              <MapPin className="w-5 h-5 text-emerald-600 shrink-0" />
              <h3 className="text-base font-extrabold text-foreground">
                Location Details
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Address */}
              <div className="sm:col-span-3 space-y-1.5">
                <label className="text-xs font-bold text-foreground flex items-center gap-1">
                  Full Address / Location <span className="text-rose-500">*</span>
                </label>
                <Input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="e.g. House 42, Road 11, Banani, Dhaka"
                  required
                  className="rounded-2xl text-xs h-11 border-border focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Latitude */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground">
                  Latitude (Optional)
                </label>
                <Input
                  type="number"
                  step="any"
                  name="latitude"
                  value={formData.latitude}
                  onChange={handleChange}
                  placeholder="23.8103"
                  className="rounded-2xl text-xs h-11 border-border"
                />
              </div>

              {/* Longitude */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground">
                  Longitude (Optional)
                </label>
                <Input
                  type="number"
                  step="any"
                  name="longitude"
                  value={formData.longitude}
                  onChange={handleChange}
                  placeholder="90.4125"
                  className="rounded-2xl text-xs h-11 border-border"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Media & Images */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-2">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-emerald-600 shrink-0" />
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
                  type="url"
                  value={imageUrlInput}
                  onChange={(e) => setImageUrlInput(e.target.value)}
                  placeholder="Paste image URL (e.g. https://images.unsplash.com/...)"
                  className="rounded-2xl text-xs h-11 flex-1 border-border"
                />
                <Button
                  type="button"
                  onClick={handleAddImage}
                  className="rounded-2xl h-11 px-5 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5 cursor-pointer shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  Add URL
                </Button>
              </div>

              {/* Image Preview Grid */}
              {formData.images.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                  {formData.images.map((img, idx) => (
                    <div
                      key={idx}
                      className="relative group rounded-2xl overflow-hidden border border-border h-24 bg-muted"
                    >
                      <img
                        src={img}
                        alt={`Property image ${idx + 1}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "https://placehold.co/400x300?text=Invalid+Image+URL";
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(idx)}
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

          {/* Section 4: Description */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-border pb-2">
              <FileText className="w-5 h-5 text-emerald-600 shrink-0" />
              <h3 className="text-base font-extrabold text-foreground">
                Property Description
              </h3>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground">
                Description & Amenities
              </label>
              <textarea
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe key features, rooms, amenities, neighborhood highlights..."
                className="w-full rounded-2xl border border-border bg-background p-4 text-xs font-medium text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
              />
            </div>
          </div>

          {/* Submit Actions */}
          <div className="pt-4 border-t border-border flex flex-col-reverse sm:flex-row justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              className="rounded-2xl py-3 text-xs font-bold border-border"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={loading}
              className="rounded-2xl py-3 px-8 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/25 gap-2 cursor-pointer transition-all active:scale-95"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Updating Property...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
