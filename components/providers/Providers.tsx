"use client";

import { SessionProvider } from "next-auth/react";

// This component wraps all other providers (Auth, Theme, Toasts, etc.)
// ensuring they render on the client side.
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      {children}
    </SessionProvider>
  );
}