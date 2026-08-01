import { getMyPropertiesAction } from "@/app/features/landlord/actions/getMyPropertiesAction";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Eye, MapPin, Plus, Pencil } from "lucide-react";
import Link from "next/link";
import { DeletePropertyButton } from "../_components/DeletePropertyButton";

export default async function LandlordPropertiesPage() {
  const myPropertyData = await getMyPropertiesAction();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-foreground">
            My Properties
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Manage and monitor all your listed rental properties.
          </p>
        </div>
        <Link href="/landlord/properties/new">
          <Button className="rounded-2xl font-bold text-xs px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/25 flex items-center gap-1.5 cursor-pointer">
            <Plus className="w-4 h-4" />
            Create Property
          </Button>
        </Link>
      </div>

      {myPropertyData.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-border/80 rounded-3xl p-8 space-y-4 bg-muted/10">
          <Building2 className="w-12 h-12 text-muted-foreground/60 mx-auto" />
          <div className="space-y-1">
            <h3 className="text-base font-bold text-foreground">No properties listed yet</h3>
            <p className="text-xs text-muted-foreground">
              Start listing your properties to receive rental applications from tenants.
            </p>
          </div>
          <Link href="/landlord/properties/new">
            <Button className="rounded-2xl font-bold text-xs px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/25 flex items-center gap-1.5 cursor-pointer mx-auto">
              <Plus className="w-4 h-4" />
              Create Property
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {myPropertyData.map((property: any) => (
            <Card
              key={property.id}
              className="rounded-3xl overflow-hidden border-border/80 hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <CardHeader className="p-5 pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center shrink-0">
                        <Building2 className="w-5 h-5" />
                      </div>
                      <div>
                        <CardTitle className="text-base font-bold text-foreground line-clamp-1">
                          {property.title}
                        </CardTitle>
                        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-emerald-600 shrink-0" />
                          <span className="truncate">
                            {property.address || property.location || "Location N/A"}
                          </span>
                        </p>
                      </div>
                    </div>

                    {/* Read-Only Availability Badge */}
                    {property.availability === "UNAVAILABLE" ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 shrink-0">
                        🔴 Unavailable
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shrink-0">
                        🟢 Available
                      </span>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="px-5 py-3 space-y-2 text-xs">
                  <p className="text-muted-foreground line-clamp-2">
                    {property.description}
                  </p>
                  <div className="flex justify-between items-center pt-2 border-t border-border/60">
                    <span className="text-muted-foreground">Price per day:</span>
                    <span className="font-extrabold text-foreground text-sm flex items-center">
                      ${Number(property.price || 0).toLocaleString()}
                    </span>
                  </div>
                </CardContent>
              </div>

              <CardFooter className="p-5 pt-3 bg-muted/20 flex items-center gap-2">
                <Link href={`/properties/${property.id}`} className="flex-1">
                  <Button className="w-full rounded-2xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5 cursor-pointer">
                    <Eye className="w-4 h-4" />
                    View Details
                  </Button>
                </Link>
                <Link href={`/dashboard/landlord/properties/${property.id}/edit`}>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-2xl text-xs font-bold gap-1.5 px-3 py-2 cursor-pointer border-border hover:bg-emerald-500/10 hover:text-emerald-600 dark:hover:text-emerald-400 shrink-0"
                    title="Edit Property"
                  >
                    <Pencil className="w-3.5 h-3.5" />
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
