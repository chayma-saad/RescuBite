import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/components/shared/AuthProvider";

export const metadata: Metadata = {
  title: "RescuBite — Less Waste. More Impact.",
  description: "AI-powered platform helping restaurants reduce food waste through demand prediction, dynamic discounting and community redistribution.",
  keywords: ["food waste", "restaurant", "sustainability", "Tunisia"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
