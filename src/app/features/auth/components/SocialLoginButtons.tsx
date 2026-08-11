"use client";

import Script from "next/script";
import { useCallback, useEffect, useRef, useState } from "react";
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

interface GoogleButtonOptions {
  type: "icon";
  shape: "circle";
  theme: "outline";
  size: "large";
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
          renderButton: (element: HTMLElement, options: GoogleButtonOptions) => void;
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
  const googleInitializedRef = useRef(false);
  const [googleSdkState, setGoogleSdkState] = useState<"loading" | "ready" | "failed">("loading");
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
    const googleIdentity = window.google?.accounts?.id;
    const buttonContainer = googleButtonRef.current;

    if (!googleClientId || !googleIdentity || !buttonContainer || googleInitializedRef.current) {
      return;
    }

    try {
      googleIdentity.initialize({
        client_id: googleClientId,
        callback: handleGoogleCredential,
      });
      buttonContainer.replaceChildren();
      googleIdentity.renderButton(buttonContainer, {
        type: "icon",
        theme: "outline",
        size: "large",
        shape: "circle",
      });

      if (buttonContainer.childElementCount > 0) {
        googleInitializedRef.current = true;
        setGoogleSdkState("ready");
      } else {
        setGoogleSdkState("failed");
      }
    } catch {
      googleInitializedRef.current = false;
      setGoogleSdkState("failed");
    }
  }, [googleClientId, handleGoogleCredential]);

  useEffect(() => {
    if (!googleClientId || googleInitializedRef.current) return;
    initializeGoogle();
  }, [googleClientId, initializeGoogle]);

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
  {googleClientId && (
    <Script
      src="https://accounts.google.com/gsi/client"
      strategy="afterInteractive"
      onLoad={initializeGoogle}
      onReady={initializeGoogle}
      onError={() => {
        setGoogleSdkState("failed");
        toast.error("Google Login could not be loaded. Please try again.");
      }}
    />
  )}

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
  <div className="flex size-11 items-center justify-center">
    <div
      ref={googleButtonRef}
      className={`size-10 overflow-hidden rounded-full ${
        provider !== null ? "pointer-events-none opacity-50" : ""
      }`}
    />
    {googleSdkState !== "ready" && (
      <button
        type="button"
        disabled={provider !== null}
        onClick={() => {
          if (!googleClientId) {
            toast.error("Google login is not configured.");
          } else if (googleSdkState === "failed") {
            toast.error("Google Login is unavailable. Please try again.");
          } else {
            toast.error("Google Login is still loading. Please try again.");
          }
        }}
        className="flex size-10 items-center justify-center rounded-full border border-border bg-background shadow-sm disabled:opacity-50"
        aria-label="Continue with Google"
        title="Continue with Google"
      >
        <LoaderCircle className={googleSdkState === "loading" && googleClientId ? "size-5 animate-spin" : "size-5"} />
      </button>
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
