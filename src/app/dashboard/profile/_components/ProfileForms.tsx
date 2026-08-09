"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { KeyRound, LoaderCircle, Phone, Save, UserRound } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/app/features/auth/hooks/use-auth";
import {
  changePasswordAction,
  updateProfileAction,
} from "@/app/features/profile/actions/profileActions";
import type { ProfileUser } from "@/app/features/profile/types";
import {
  changePasswordValidation,
  updateProfileValidation,
} from "@/app/features/profile/validations";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type FieldErrors = Record<string, string>;

const getErrors = (errors: { flatten: () => { fieldErrors: Record<string, string[] | undefined> } }): FieldErrors =>
  Object.fromEntries(
    Object.entries(errors.flatten().fieldErrors).map(([field, messages]) => [field, messages?.[0] || "Invalid value"]),
  );

export function ProfileForms({ user }: { user: ProfileUser }) {
  const router = useRouter();
  const { getUser } = useAuth();
  const [profilePending, startProfileTransition] = useTransition();
  const [passwordPending, startPasswordTransition] = useTransition();
  const [profile, setProfile] = useState({ name: user.name || "", phone: user.phone || "" });
  const [passwords, setPasswords] = useState({ currentPassword: "", newPassword: "" });
  const [profileErrors, setProfileErrors] = useState<FieldErrors>({});
  const [passwordErrors, setPasswordErrors] = useState<FieldErrors>({});

  const submitProfile = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validation = updateProfileValidation.safeParse(profile);
    if (!validation.success) {
      setProfileErrors(getErrors(validation.error));
      return;
    }

    setProfileErrors({});
    startProfileTransition(async () => {
      const result = await updateProfileAction(validation.data);
      if (!result.ok) {
        setProfileErrors(result.errors || {});
        toast.error(result.message);
        return;
      }

      toast.success(result.message);
      await getUser();
      router.refresh();
    });
  };

  const submitPassword = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validation = changePasswordValidation.safeParse(passwords);
    if (!validation.success) {
      setPasswordErrors(getErrors(validation.error));
      return;
    }

    setPasswordErrors({});
    startPasswordTransition(async () => {
      const result = await changePasswordAction(validation.data);
      if (!result.ok) {
        setPasswordErrors(result.errors || {});
        toast.error(result.message);
        return;
      }

      toast.success(result.message);
      setPasswords({ currentPassword: "", newPassword: "" });
    });
  };

  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.35fr_0.65fr]">
      <Card className="rounded-2xl border-none bg-white shadow-sm dark:bg-card">
        <CardHeader>
          <CardTitle className="text-lg font-bold">Edit Personal Information</CardTitle>
          <CardDescription className="text-sm">Update the name and phone number associated with your account.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={submitProfile} className="grid grid-cols-1 gap-4 sm:grid-cols-2" noValidate>
            <div className="space-y-1.5">
              <label htmlFor="profile-name" className="text-xs font-semibold text-foreground">Full name</label>
              <div className="relative">
                <UserRound className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="profile-name"
                  value={profile.name}
                  onChange={(event) => setProfile((current) => ({ ...current, name: event.target.value }))}
                  disabled={profilePending}
                  aria-invalid={Boolean(profileErrors.name)}
                  aria-describedby={profileErrors.name ? "profile-name-error" : undefined}
                  className="rounded-xl pl-9"
                />
              </div>
              {profileErrors.name && <p id="profile-name-error" className="text-xs text-rose-600 dark:text-rose-400">{profileErrors.name}</p>}
            </div>

            <div className="space-y-1.5">
              <label htmlFor="profile-phone" className="text-xs font-semibold text-foreground">Phone number</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="profile-phone"
                  type="tel"
                  value={profile.phone}
                  onChange={(event) => setProfile((current) => ({ ...current, phone: event.target.value }))}
                  disabled={profilePending}
                  aria-invalid={Boolean(profileErrors.phone)}
                  aria-describedby={profileErrors.phone ? "profile-phone-error" : undefined}
                  className="rounded-xl pl-9"
                />
              </div>
              {profileErrors.phone && <p id="profile-phone-error" className="text-xs text-rose-600 dark:text-rose-400">{profileErrors.phone}</p>}
            </div>

            <div className="sm:col-span-2 flex justify-end pt-1">
              <Button type="submit" disabled={profilePending} className="gap-2 rounded-xl bg-emerald-600 text-xs font-bold text-white hover:bg-emerald-700">
                {profilePending ? <LoaderCircle className="size-4 animate-spin" /> : <Save className="size-4" />}
                {profilePending ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="rounded-2xl border-none bg-white shadow-sm dark:bg-card">
        <CardHeader>
          <CardTitle className="text-lg font-bold">Change Password</CardTitle>
          <CardDescription className="text-sm">Use your current password to set a new one.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={submitPassword} className="space-y-4" noValidate>
            <div className="space-y-1.5">
              <label htmlFor="current-password" className="text-xs font-semibold text-foreground">Current password</label>
              <Input
                id="current-password"
                type="password"
                autoComplete="current-password"
                value={passwords.currentPassword}
                onChange={(event) => setPasswords((current) => ({ ...current, currentPassword: event.target.value }))}
                disabled={passwordPending}
                aria-invalid={Boolean(passwordErrors.currentPassword)}
                aria-describedby={passwordErrors.currentPassword ? "current-password-error" : undefined}
                className="rounded-xl"
              />
              {passwordErrors.currentPassword && <p id="current-password-error" className="text-xs text-rose-600 dark:text-rose-400">{passwordErrors.currentPassword}</p>}
            </div>

            <div className="space-y-1.5">
              <label htmlFor="new-password" className="text-xs font-semibold text-foreground">New password</label>
              <Input
                id="new-password"
                type="password"
                autoComplete="new-password"
                value={passwords.newPassword}
                onChange={(event) => setPasswords((current) => ({ ...current, newPassword: event.target.value }))}
                disabled={passwordPending}
                aria-invalid={Boolean(passwordErrors.newPassword)}
                aria-describedby={passwordErrors.newPassword ? "new-password-error" : undefined}
                className="rounded-xl"
              />
              {passwordErrors.newPassword && <p id="new-password-error" className="text-xs text-rose-600 dark:text-rose-400">{passwordErrors.newPassword}</p>}
            </div>

            <Button type="submit" disabled={passwordPending} className="w-full gap-2 rounded-xl bg-emerald-600 text-xs font-bold text-white hover:bg-emerald-700">
              {passwordPending ? <LoaderCircle className="size-4 animate-spin" /> : <KeyRound className="size-4" />}
              {passwordPending ? "Updating..." : "Update Password"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
