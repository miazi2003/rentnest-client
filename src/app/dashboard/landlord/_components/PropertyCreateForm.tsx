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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
    } catch (error) {
      toast.error("An unexpected error occurred while creating property.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-4xl mx-auto rounded-3xl border border-border shadow-xl overflow-hidden bg-card">

      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 p-6 sm:p-8 text-white relative">
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-bold tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              New Property Listing
            </div>
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

      <CardContent className="p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-8">

          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-border pb-2">
              <Building2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <h3 className="text-base font-extrabold text-foreground">
                Basic Information
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

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


          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-border pb-2">
              <MapPin className="w-5 h-5 text-emerald-600 shrink-0" />
              <h3 className="text-base font-extrabold text-foreground">
                Location Details
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

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
