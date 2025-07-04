import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";

import { QueryProvider } from "./context/QueryProvider";

const roboto = Roboto({
  subsets: ["latin"],
  variable: "--font-roboto",
  weight: ["100", "300", "400", "500", "700", "900"],
  style: "normal",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Valiwo",
  description: "Social Media Platform",
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
            {children}
          </QueryProvider>
        </body>
      </html>
  );
}
