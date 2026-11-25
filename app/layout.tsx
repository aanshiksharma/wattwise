import type { Metadata } from "next";
import { Geist, Geist_Mono, Montserrat } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Footer } from "@/components/layout/footer";

const montserratHeading = Montserrat({
  subsets: ["latin"],
  variable: "--font-heading",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "WattWise – Smart home power-backup planner",
  description:
    "Add your appliances, see your daily power use in real time and get reliable power backup suggestions that fit your needs and budget.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={cn(
        "h-full",
        "antialiased",
        "dark",
        geistSans.variable,
        geistMono.variable,
        montserratHeading.variable,
      )}
    >
      <body className="min-h-full flex flex-col">
        <header className="mx-auto flex max-w-7xl items-center px-4 py-5 sm:px-6">
          <span className="text-lg font-semibold tracking-tight">WattWise</span>
        </header>

        {children}

        <Footer />
      </body>
    </html>
  );
}
