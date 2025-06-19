"use client";

import { SessionProvider } from "@/components/providers/SessionProvider";
import { ClientOnly } from "@/components/providers/ClientOnly";
import { ThemeProvider } from "next-themes";
import { ErrorBoundary } from "@/components/providers/ErrorBoundary";

export function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary>
      <ClientOnly>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SessionProvider>
            {children}
          </SessionProvider>
        </ThemeProvider>
      </ClientOnly>
    </ErrorBoundary>
  );
} 