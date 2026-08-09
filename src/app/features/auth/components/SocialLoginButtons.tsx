"use client";

import Script from "next/script";
import { useCallback, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/app/features/auth/hooks/use-auth";
import { facebookLoginAction, googleLoginAction } from "@/app/features/auth/actions/socialLoginActions";
import type { IUser } from "@/app/features/auth/types";

interface GoogleCredentialResponse {
  credential?: string;
}

interface FacebookLoginResponse {
  authResponse?: { accessToken?: string };
  status?: string;
}

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (options: { client_id: string; callback: (response: GoogleCredentialResponse) => void }) => void;
          renderButton: (element: HTMLElement, options: Record<string, string | number>) => void;
        };
      };
    };
    FB?: {
      init: (options: { appId: string; cookie: boolean; xfbml: boolean; version: string }) => void;
      login: (callback: (response: FacebookLoginResponse) => void, options: { scope: string }) => void;
    };
  }
}

const dashboardByRole: Record<IUser["role"], string> = {
  ADMIN: "/dashboard/admin",
  LANDLORD: "/dashboard/landlord",
  TENANT: "/dashboard/tenant",
};

export function SocialLoginButtons() {
  const router = useRouter();
  const { getUser } = useAuth();
  const googleButtonRef = useRef<HTMLDivElement>(null);
  const [googleReady, setGoogleReady] = useState(false);
  const [facebookReady, setFacebookReady] = useState(false);
  const [provider, setProvider] = useState<"google" | "facebook" | null>(null);
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  const facebookAppId = process.env.NEXT_PUBLIC_FACEBOOK_APP_ID;

  const finishLogin = useCallback(async (message: string) => {
    const user = await getUser();
    if (!user) {
      toast.error("Login succeeded, but the authenticated user could not be loaded.");
      setProvider(null);
      return;
    }

    toast.success(message);
    window.dispatchEvent(new Event("rentnest:navigation-start"));
    router.replace(dashboardByRole[user.role] || "/dashboard");
  }, [getUser, router]);

  const handleGoogleCredential = useCallback(async (response: GoogleCredentialResponse) => {
    if (!response.credential) {
      toast.error("Google did not return an authentication credential.");
      return;
    }

    setProvider("google");
    const result = await googleLoginAction(response.credential);
    if (!result.success) {
      toast.error(result.message);
      setProvider(null);
      return;
    }
    await finishLogin(result.message);
  }, [finishLogin]);

  const initializeGoogle = useCallback(() => {
    if (!googleClientId || !window.google || !googleButtonRef.current) return;
    googleButtonRef.current.replaceChildren();
    window.google.accounts.id.initialize({ client_id: googleClientId, callback: handleGoogleCredential });
    window.google.accounts.id.renderButton(googleButtonRef.current, {
      type: "icon",
      theme: "outline",
      size: "large",
      shape: "circle",
    });
    setGoogleReady(true);
  }, [googleClientId, handleGoogleCredential]);

  const handleFacebookAuth = async (accessToken: string) => {
    setProvider("facebook");
    const result = await facebookLoginAction(accessToken);
    if (!result.success) {
      toast.error(result.message);
      setProvider(null);
      return;
    }
    await finishLogin(result.message);
  };

  const handleFacebookLogin = () => {
    if (!facebookAppId) {
      toast.error("Facebook login is not configured.");
      return;
    }
    if (!facebookReady) {
      toast.error("Facebook Login is still loading. Please try again.");
      return;
    }
    if (!window.FB) {
      toast.error("Facebook Login is unavailable. Please try again.");
      return;
    }

    window.FB.login((response) => {
      const accessToken = response.authResponse?.accessToken;
      if (!accessToken) {
        toast.error("Facebook login was not completed.");
        return;
      }

      void handleFacebookAuth(accessToken);
    }, { scope: "public_profile,email" });
  };

  return (
<div className="flex items-center justify-center gap-3">
  {/* SDK Scripts */}
  <Script
    src="https://accounts.google.com/gsi/client"
    strategy="afterInteractive"
    onReady={initializeGoogle}
  />

  {facebookAppId && (
    <Script
      src="https://connect.facebook.net/en_US/sdk.js"
      strategy="afterInteractive"
      onReady={() => {
        window.FB?.init({
          appId: facebookAppId,
          cookie: true,
          xfbml: false,
          version: "v23.0",
        });
        setFacebookReady(true);
      }}
    />
  )}

  {/* Google */}
  <div className="relative flex size-11 items-center justify-center">
    <button
      type="button"
      disabled={provider !== null}
      onClick={() => {
        if (!googleReady) {
          toast.error(
            googleClientId
              ? "Google Login is still loading. Please try again."
              : "Google login is not configured."
          );
        }
      }}
      className="flex size-11 items-center justify-center rounded-full border border-border bg-background shadow-sm transition-all hover:bg-muted hover:shadow-md disabled:pointer-events-none disabled:opacity-50"
      aria-label="Continue with Google"
      title="Continue with Google"
    >
      {provider === "google" ? (
        <LoaderCircle className="size-5 animate-spin" />
      ) : (
        <svg
          viewBox="0 0 24 24"
          className="size-5"
          aria-hidden="true"
        >
          <path
            fill="#4285F4"
            d="M21.35 12.24c0-.74-.07-1.45-.19-2.13H12v4.03h5.24a4.48 4.48 0 0 1-1.94 2.94v2.61h3.14c1.84-1.69 2.91-4.18 2.91-7.45Z"
          />
          <path
            fill="#34A853"
            d="M12 21.75c2.62 0 4.82-.87 6.43-2.36l-3.14-2.61c-.87.58-1.98.92-3.29.92-2.53 0-4.67-1.71-5.44-4.01H3.32v2.69A9.72 9.72 0 0 0 12 21.75Z"
          />
          <path
            fill="#FBBC05"
            d="M6.56 13.69A5.84 5.84 0 0 1 6.25 12c0-.59.1-1.16.31-1.69V7.62H3.32A9.73 9.73 0 0 0 2.25 12c0 1.57.38 3.06 1.07 4.38l3.24-2.69Z"
          />
          <path
            fill="#EA4335"
            d="M12 6.3c1.43 0 2.71.49 3.72 1.45l2.78-2.78A9.34 9.34 0 0 0 12 2.25a9.72 9.72 0 0 0-8.68 5.37l3.24 2.69C7.33 8.01 9.47 6.3 12 6.3Z"
          />
        </svg>
      )}
    </button>

    {/* Invisible Google Identity button */}
    {googleReady && (
      <div
        ref={googleButtonRef}
        className="absolute inset-0 z-10 overflow-hidden rounded-full opacity-0"
      />
    )}
  </div>

  {/* Facebook */}
  <Button
    type="button"
    size="icon"
    disabled={provider !== null || !facebookReady}
    onClick={handleFacebookLogin}
    className="size-11 rounded-full bg-[#1877F2] text-white shadow-sm transition-all hover:bg-[#1877F2]/90 hover:shadow-md"
    aria-label="Continue with Facebook"
    title="Continue with Facebook"
  >
    {provider === "facebook" ? (
      <LoaderCircle className="size-5 animate-spin" />
    ) : (
      <svg
        viewBox="0 0 24 24"
        className="size-5 fill-current"
        aria-hidden="true"
      >
        <path d="M13.5 22v-9h3l.45-3.5H13.5V7.26c0-1.01.28-1.7 1.73-1.7H17V2.44A23.7 23.7 0 0 0 14.4 2C11.83 2 10 3.57 10 6.45V9.5H7V13h3v9h3.5Z" />
      </svg>
    )}
  </Button>
</div>
  );
}
