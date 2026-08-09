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
      type: "standard",
      theme: "outline",
      size: "large",
      text: "continue_with",
      shape: "rectangular",
      width: 320,
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
    }, { scope: "public_profile" });
  };

  return (
    <div className="space-y-2">
      <Script src="https://accounts.google.com/gsi/client" strategy="afterInteractive" onReady={initializeGoogle} />
      {facebookAppId && (
        <Script
          src="https://connect.facebook.net/en_US/sdk.js"
          strategy="afterInteractive"
          onReady={() => {
            window.FB?.init({ appId: facebookAppId, cookie: true, xfbml: false, version: "v23.0" });
            setFacebookReady(true);
          }}
        />
      )}

      <div className="flex justify-center min-h-10">
        <div ref={googleButtonRef} className={googleReady ? "w-full flex justify-center" : "hidden"} />
        {!googleReady && (
          <Button
            type="button"
            variant="outline"
            disabled={provider !== null}
            onClick={() => toast.error(googleClientId ? "Google Login is still loading. Please try again." : "Google login is not configured.")}
            className="w-full rounded-xl text-xs font-bold"
          >
            {provider === "google" && <LoaderCircle className="size-4 animate-spin" />}
            Continue with Google
          </Button>
        )}
      </div>

      <Button
        type="button"
        variant="outline"
        disabled={provider !== null}
        onClick={handleFacebookLogin}
        className="w-full rounded-xl text-xs font-bold"
      >
        {provider === "facebook" && <LoaderCircle className="size-4 animate-spin" />}
        Continue with Facebook
      </Button>
    </div>
  );
}
