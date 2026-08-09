import { getMyPropertiesAction } from "@/app/features/landlord/actions/getMyPropertiesAction";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Building2,
  Eye,
  MapPin,
  Pencil,
  Plus,
} from "lucide-react";
import Link from "next/link";
import { DeletePropertyButton } from "../_components/DeletePropertyButton";
import type { ILandlordProperty } from "../types/landlord.types";

export const dynamic = "force-dynamic";

export default async function LandlordPropertiesPage() {
  const response = await getMyPropertiesAction();

  const myPropertyData: ILandlordProperty[] = Array.isArray(response)
    ? response
    : Array.isArray(response?.data)
      ? response.data
      : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-foreground">
            My Properties
          </h1>

          <p className="mt-0.5 text-xs text-muted-foreground">
            Manage and monitor all your listed rental properties.
          </p>
        </div>

        <Link href="/dashboard/landlord/properties/new">
          <Button className="flex cursor-pointer items-center gap-1.5 rounded-2xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-emerald-600/25 hover:bg-emerald-700">
            <Plus className="h-4 w-4" />
            Create Property
          </Button>
        </Link>
      </div>

      {myPropertyData.length === 0 ? (
        <div className="space-y-4 rounded-3xl border border-dashed border-border/80 bg-muted/10 p-8 py-16 text-center">
          <Building2 className="mx-auto h-12 w-12 text-muted-foreground/60" />

          <div className="space-y-1">
            <h3 className="text-base font-bold text-foreground">
              No properties listed yet
            </h3>

            <p className="text-xs text-muted-foreground">
              Start listing your properties to receive rental applications from
              tenants.
            </p>
          </div>

          <Link href="/dashboard/landlord/properties/new">
            <Button className="mx-auto flex cursor-pointer items-center gap-1.5 rounded-2xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-emerald-600/25 hover:bg-emerald-700">
              <Plus className="h-4 w-4" />
              Create Property
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {myPropertyData.map((property) => (
            <Card
              key={property.id}
              className="flex flex-col justify-between overflow-hidden rounded-3xl border-border/80 transition-all duration-300 hover:shadow-xl"
            >
              <div>
                <CardHeader className="p-5 pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60">
                        <Building2 className="h-5 w-5" />
                      </div>

                      <div className="min-w-0">
                        <CardTitle className="line-clamp-1 text-base font-bold text-foreground">
                          {property.title || "Untitled Property"}
                        </CardTitle>

                        <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                          <MapPin className="h-3 w-3 shrink-0 text-emerald-600" />

                          <span className="truncate">
                            {property.address ||
                              property.location ||
                              "Location N/A"}
                          </span>
                        </p>
                      </div>
                    </div>

                    {property.availability === "UNAVAILABLE" ? (
                      <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-rose-500/20 bg-rose-500/10 px-2.5 py-1 text-[10px] font-bold text-rose-600 dark:text-rose-400">
                        🔴 Unavailable
                      </span>
                    ) : (
                      <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                        🟢 Available
                      </span>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="space-y-2 px-5 py-3 text-xs">
                  <p className="line-clamp-2 text-muted-foreground">
                    {property.description || "No description available."}
                  </p>

                  <div className="flex items-center justify-between border-t border-border/60 pt-2">
                    <span className="text-muted-foreground">
                      Price per day:
                    </span>

                    <span className="flex items-center text-sm font-extrabold text-foreground">
                      ${Number(property.price ?? 0).toLocaleString()}
                    </span>
                  </div>
                </CardContent>
              </div>

              <CardFooter className="flex items-center gap-2 bg-muted/20 p-5 pt-3">
                <Link
                  href={`/properties/${property.id}`}
                  className="flex-1"
                >
                  <Button className="w-full cursor-pointer gap-1.5 rounded-2xl bg-emerald-600 text-xs font-bold text-white hover:bg-emerald-700">
                    <Eye className="h-4 w-4" />
                    View Details
                  </Button>
                </Link>

                <Link
                  href={`/dashboard/landlord/properties/${property.id}/edit`}
                >
                  <Button
                    variant="outline"
                    size="sm"
                    title="Edit Property"
                    className="shrink-0 cursor-pointer gap-1.5 rounded-2xl border-border px-3 py-2 text-xs font-bold hover:bg-emerald-500/10 hover:text-emerald-600 dark:hover:text-emerald-400"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                    Edit
                  </Button>
                </Link>

                <DeletePropertyButton propertyId={property.id} />
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
