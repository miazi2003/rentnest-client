import { MoreHorizontal } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

type StatsCardProps = {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  growth?: string;
  growthText?: string;
};

export default function StatsCard({
  title,
  value,
  icon,
  growth,
  growthText = "last month",
}: StatsCardProps) {
  return (
    <Card className="rounded-2xl border shadow-sm">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-emerald-200">
            {icon}
          </div>

          <button className="text-muted-foreground">
            <MoreHorizontal size={18} />
          </button>
        </div>

        <div className="mt-6">
          <p className="text-sm text-muted-foreground">{title}</p>

          <h2 className="mt-1 text-4xl font-bold">{value}</h2>

          {growth && (
            <div className="mt-3 flex items-center gap-2">
              <span className="rounded-full bg-emerald-100 px-2 py-1 text-xs font-medium text-emerald-600">
                ↑ {growth}
              </span>

              <span className="text-xs text-muted-foreground">
                {growthText}
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}