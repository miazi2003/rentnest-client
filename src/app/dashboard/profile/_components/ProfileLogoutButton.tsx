"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, LogOut } from "lucide-react";
import { toast } from "sonner";
import { logoutAction } from "@/app/features/auth/actions/logoutAction";
import { useAuth } from "@/app/features/auth/hooks/use-auth";
import { Button } from "@/components/ui/button";

export function ProfileLogoutButton() {
  const router = useRouter();
  const { setUser } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      const result = await logoutAction();

      if (!result.success) {
        toast.error(result.message || "Logout failed. Please try again.");
        return;
      }

      setUser(null);
      toast.success("Logged out successfully");
      router.replace("/login");
      router.refresh();
    } catch {
      toast.error("Unable to log out. Please try again.");
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <Button
      type="button"
      variant="destructive"
      onClick={handleLogout}
      disabled={isLoggingOut}
      className="h-9 gap-2 text-xs font-semibold"
    >
      {isLoggingOut ? (
        <Loader2 className="size-3.5 animate-spin" />
      ) : (
        <LogOut className="size-3.5" />
      )}
      {isLoggingOut ? "Logging out..." : "Log out"}
    </Button>
  );
}
