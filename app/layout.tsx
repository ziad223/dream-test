import type { Metadata } from "next";
import { Montserrat, Pacifico } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-montserrat",
});

const cursive = Pacifico({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-cursive",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://angular.pixelstrap.com"),
  title: {
    default: "Multikart - Where Vendors Shine Together | Furniture Store",
    template: "%s | Multikart",
  },
  description:
    "Multikart: Shop Unique, Sell Exceptional. Discover premium modern furniture, minimalist Scandinavian sofas, velvet chairs, and luxury home decor with free worldwide shipping.",
  keywords: [
    "Multikart",
    "Furniture Store",
    "Modern Chairs",
    "Scandinavian Sofa",
    "Home Decor",
    "Minimalist Furniture",
    "E-commerce",
    "Multi-Vendor Marketplace",
    "Furniture Dark Theme",
  ],
  authors: [{ name: "Pixelstrap", url: "https://angular.pixelstrap.com" }],
  creator: "Pixelstrap",
  publisher: "Multikart",
  applicationName: "Multikart E-Commerce",
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#181615" },
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
  ],
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.png", type: "image/png" },
    ],
    shortcut: ["/favicon.ico"],
    apple: [
      { url: "/favicon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  openGraph: {
    title: "Multikart - Modern Minimalist Furniture & Decor",
    description:
      "Shop the best collection of modern luxury furniture, classic furnishing, and stylish home essentials on Multikart.",
    url: "https://angular.pixelstrap.com/multikart-frontend/?theme=furniture_dark",
    siteName: "Multikart",
    images: [
      {
        url: "/home/hero-image.png",
        width: 1200,
        height: 630,
        alt: "Multikart Furniture Preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Multikart - Where Vendors Shine Together",
    description:
      "Explore handcrafted designer furniture, accent chairs, and minimalist sofas at Multikart.",
    images: ["/home/hero-image.png"],
    creator: "@pixelstrap",
  },
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
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${montserrat.variable} ${cursive.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans bg-[#171412] text-[#cccccc] selection:bg-[#d4996a] selection:text-white">
        {children}
      </body>
    </html>
  );
}
