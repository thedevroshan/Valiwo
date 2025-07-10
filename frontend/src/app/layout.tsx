import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";

import { QueryProvider } from "./Wrappers/QueryProvider";

// Context
import { AuthUserProvider } from "./context/AuthUserContext";

// Utils
import NotSupportedLayer from "./utils/NotSupportedLayer";

const roboto = Roboto({
  subsets: ["latin"],
  variable: "--font-roboto",
  weight: ["100", "300", "400", "500", "700", "900"],
  style: "normal",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Valiwo",
  description: "Social Media Platform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${roboto.className} antialiased vsc-initialized`}>
          <QueryProvider>
            <AuthUserProvider>
              <NotSupportedLayer/>
              {children}
            </AuthUserProvider>
          </QueryProvider>
      </body>
    </html>
  );
}
