"use client"; // Error components must be Client Components

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-10 text-foreground">
      <div className="w-full max-w-2xl rounded-[2rem] border border-input bg-card/95 p-8 shadow-xl shadow-black/5 backdrop-blur-xl">
        <div className="inline-flex items-center rounded-full bg-destructive/10 px-3 py-1 text-sm font-semibold text-destructive">
          Error
        </div>

        <h1 className="mt-6 text-4xl font-semibold tracking-tight text-foreground">
          Something went wrong
        </h1>

        <p className="mt-4 text-sm leading-6 text-muted-foreground">
          We couldn’t load this page. Try again, or refresh the page if the
          problem persists.
        </p>

        {error.message && (
          <div className="mt-6 rounded-3xl border border-muted/50 bg-muted/5 p-6 text-left text-sm text-foreground">
            <p className="text-sm font-semibold text-foreground">
              Technical details
            </p>
            <pre className="mt-3 max-h-64 overflow-auto whitespace-pre-wrap break-words text-xs text-muted-foreground">
              {error.message}
            </pre>
            {error.digest && (
              <p className="mt-3 text-xs text-muted-foreground">
                Error ID: {error.digest}
              </p>
            )}
          </div>
        )}

        <div className="mt-8 flex justify-center">
          <Button variant="default" size="lg" onClick={reset}>
            Try again
          </Button>
        </div>
      </div>
    </div>
  );
}
