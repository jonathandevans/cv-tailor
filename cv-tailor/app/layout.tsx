import { ReactNode } from "react";
import type { Metadata } from "next";
import { generateMetadata } from "@/lib/metadata";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { ReactQueryProvider } from "@/components/providers/react-query";
import { ThemeProvider } from "@/components/providers/theme";
import "./globals.css";

export const metadata: Metadata = generateMetadata();

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <ReactQueryProvider>
            {children}
            <Toaster richColors={true} />
          </ReactQueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
