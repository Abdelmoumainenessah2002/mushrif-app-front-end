import { Button } from "@/components/ui/button";
import { oauthProviders, type OAuthProvider } from "@/lib/auth-service";

function ProviderIcon({ provider }: { provider: OAuthProvider }) {
  if (provider === "google")
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
        <path d="M21.6 12.2c0-.7-.1-1.4-.2-2.1H12v4h5.4a4.6 4.6 0 0 1-2 3V20h3.2c1.9-1.8 3-4.4 3-7.8ZM12 22c2.7 0 5-.9 6.6-2.4l-3.2-2.5c-.9.6-2 1-3.4 1-2.6 0-4.8-1.8-5.6-4.2H3.1v2.6A10 10 0 0 0 12 22ZM6.4 13.9a6 6 0 0 1 0-3.8V7.5H3.1a10 10 0 0 0 0 9l3.3-2.6ZM12 5.9c1.5 0 2.8.5 3.8 1.5l2.9-2.9A9.5 9.5 0 0 0 12 2a10 10 0 0 0-8.9 5.5l3.3 2.6A6 6 0 0 1 12 5.9Z" />
      </svg>
    );
  if (provider === "facebook")
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
        <path d="M14 21v-8h2.7l.4-3H14V8c0-.9.3-1.5 1.6-1.5H17V3.8c-.3 0-1.3-.1-2.4-.1-2.4 0-4 1.4-4 4.1V10H8v3h2.6v8H14Z" />
      </svg>
    );
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
      <path d="M12 2a10 10 0 0 0-3.2 19.5c.5.1.7-.2.7-.5v-1.9c-2.8.6-3.4-1.2-3.4-1.2-.4-1.2-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 0 1.5 1 1.5 1 .9 1.5 2.3 1.1 2.9.8.1-.6.3-1.1.6-1.3-2.2-.3-4.5-1.1-4.5-5a4 4 0 0 1 1-2.7c-.1-.2-.4-1.3.1-2.7 0 0 .9-.3 2.8 1a9.8 9.8 0 0 1 5.1 0c1.9-1.3 2.8-1 2.8-1 .5 1.4.2 2.5.1 2.7a4 4 0 0 1 1 2.7c0 3.9-2.3 4.7-4.5 5 .4.3.7.9.7 1.8V21c0 .3.2.6.7.5A10 10 0 0 0 12 2Z" />
    </svg>
  );
}
export function OAuthOptions({
  disabled,
  onSelect,
}: {
  disabled: boolean;
  onSelect: (provider: OAuthProvider) => void;
}) {
  return (
    <div className="mt-8">
      <div className="flex items-center gap-4 text-xs text-muted-foreground">
        <span className="h-px flex-1 bg-border" />
        Or continue with
        <span className="h-px flex-1 bg-border" />
      </div>
      <div className="mt-5 grid grid-cols-3 gap-3">
        {oauthProviders
          .filter((provider) => provider.enabled)
          .map((provider) => (
            <Button
              key={provider.id}
              type="button"
              variant="outline"
              className="h-12 px-2"
              disabled={disabled}
              aria-label={`Continue with ${provider.name}`}
              onClick={() => onSelect(provider.id)}
            >
              <ProviderIcon provider={provider.id} />
              <span className="text-xs">{provider.name}</span>
            </Button>
          ))}
      </div>
    </div>
  );
}
