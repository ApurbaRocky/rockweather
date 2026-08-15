import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { AppScene } from "@/components/app-scene";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { Providers } from "@/components/providers";
import { APP_NAME, APP_TAGLINE } from "@/lib/constants";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "RockWeather — Live Weather Forecast",
    template: "%s — RockWeather",
  },
  description:
    "Get live weather conditions, hourly forecasts and multi-day weather forecasts for locations around the world with RockWeather.",
  applicationName: APP_NAME,
  keywords: [
    "weather",
    "live weather",
    "forecast",
    "hourly forecast",
    "weather map",
    "air quality",
    "RockWeather",
  ],
  authors: [{ name: "RockWeather" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: APP_NAME,
    title: "RockWeather — Live Weather Forecast",
    description:
      "Get live weather conditions, hourly forecasts and multi-day weather forecasts for locations around the world with RockWeather.",
  },
  twitter: {
    card: "summary_large_image",
    title: "RockWeather — Live Weather Forecast",
    description:
      "Get live weather conditions, hourly forecasts and multi-day weather forecasts for locations around the world with RockWeather.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0a1226",
};

const THEME_INIT_SCRIPT = `(function(){try{var t=window.localStorage.getItem('rockweather.theme')||'dark';var d=t==='dark'||(t==='system'&&window.matchMedia('(prefers-color-scheme: dark)').matches);document.documentElement.classList.toggle('dark',d);}catch(e){document.documentElement.classList.add('dark')}})();`;

const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: APP_NAME,
  alternateName: "RockWeather",
  url: SITE_URL,
  description:
    "Live weather conditions, hourly forecasts and multi-day weather forecasts for locations around the world.",
  slogan: APP_TAGLINE,
  publisher: {
    "@type": "Organization",
    name: "RockWeather",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
        />
      </head>
      <body className="flex min-h-dvh flex-col">
        <Providers>
          <Header />
          <AppScene>{children}</AppScene>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
