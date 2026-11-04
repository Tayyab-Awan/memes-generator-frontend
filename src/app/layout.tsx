import type { Metadata } from "next";
import { Anton, Geist, Geist_Mono } from "next/font/google";
import { QueryProvider } from "@/shared/api/query-provider";
import { SiteHeader } from "@/shared/ui/site-header";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const anton = Anton({
  variable: "--font-anton",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Meme Generator",
    template: "%s · Meme Generator",
  },
  description: "Upload an image, add captions and share your meme.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${anton.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col font-sans">
        <QueryProvider>
          <SiteHeader />
          <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:py-10">
            {children}
          </main>
        </QueryProvider>
      </body>
    </html>
  );
}
