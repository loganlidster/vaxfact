import type { Metadata } from "next";
import { Inter, Source_Serif_4 } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
  weight: ["400", "600", "700", "900"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://vaxfact.net"),
  title: {
    default: "VaxFact.net — Evidence-Based Vaccine Information for Parents",
    template: "%s | VaxFact.net",
  },
  description:
    "Research vaccine risks, benefits, and side effects with transparent evidence scoring. Compare disease risk vs. vaccine risk for 20 vaccines. Trusted by parents who want real data.",
  keywords: [
    "vaccine information",
    "vaccine side effects",
    "vaccine safety",
    "childhood vaccines",
    "vaccine schedule",
    "MMR vaccine",
    "DTaP vaccine",
    "HPV vaccine",
    "flu vaccine",
    "COVID vaccine",
    "vaccine benefits risks",
    "evidence-based vaccines",
  ],
  authors: [{ name: "VaxFact.net" }],
  creator: "VaxFact.net",
  publisher: "VaxFact.net",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "VaxFact.net — Evidence-Based Vaccine Information for Parents",
    description:
      "Research vaccine risks, benefits, and side effects with transparent evidence scoring. Compare disease risk vs. vaccine risk for 20 vaccines.",
    url: "https://vaxfact.net",
    siteName: "VaxFact.net",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "VaxFact.net — Evidence-Based Vaccine Research",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "VaxFact.net — Evidence-Based Vaccine Information",
    description:
      "Research vaccine risks, benefits, and side effects with transparent evidence scoring for 20 vaccines.",
    images: ["/og-image.png"],
  },
  alternates: {
    canonical: "https://vaxfact.net",
  },
  verification: {
    google: "vaxfact-google-verification",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${sourceSerif.variable}`}>
      <head>
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-JNE1MHNMR5"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-JNE1MHNMR5');
          `}
        </Script>
      </head>
      <body>{children}</body>
    </html>
  );
}