import "./globals.css";
import type { Metadata } from "next";
import Providers from "@/lib/redux/Provider";
import { SuperTokensProvider } from "@/lib/auth/supertokensProvider";

export const metadata: Metadata = {
  title: "Auto Deploy",
  description: "To deploy to azure",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background font-sans antialiased">
        <SuperTokensProvider>
          <Providers>
            {children}
          </Providers>
        </SuperTokensProvider>
      </body>
    </html>
  );
}
