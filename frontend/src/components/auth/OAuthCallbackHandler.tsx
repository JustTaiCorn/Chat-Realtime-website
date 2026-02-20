import { useGoogleOAuthCallback } from "@/hooks/useGoogleOAuthCallback";

export const OAuthCallbackHandler = () => {
  useGoogleOAuthCallback();
  return null;
};
