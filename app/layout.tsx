import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Search - AI-Powered Search Engine by Festus Kahunla',
  description: 'A modern search engine powered by Google\'s Gemini AI, created by Festus Kahunla, Electrical and Machine Learning Engineer. Get accurate search results with enhanced privacy.',
  authors: [{ name: 'Festus Kahunla' }],
  keywords: ['search engine', 'AI search', 'Gemini AI', 'Festus Kahunla', 'machine learning', 'electrical engineering'],
  robots: {
    index: true,
    follow: true,
  },
  generator: 'Next.js',
  applicationName: 'Search',
  referrer: 'origin-when-cross-origin',
  creator: 'Festus Kahunla',
  publisher: 'Festus Kahunla',
  metadataBase: new URL('https://search.kahunla.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Search - AI-Powered Search Engine by Festus Kahunla',
    description: 'A modern search engine powered by Google\'s Gemini AI, created by Festus Kahunla, Electrical and Machine Learning Engineer. Get accurate search results with enhanced privacy.',
    url: 'https://search.kahunla.com',
    siteName: 'Search',
    images: [
      {
        url: '/search.png',
        width: 1200,
        height: 630,
        alt: 'Search - AI-Powered Search Engine',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Search - AI-Powered Search Engine by Festus Kahunla',
    description: 'A modern search engine powered by Google\'s Gemini AI, created by Festus Kahunla, Electrical and Machine Learning Engineer. Get accurate search results with enhanced privacy.',
    images: ['/search.png'],
    creator: '@festuskahunla',
  },
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/apple-touch-icon.png',
    other: [
      {
        rel: 'apple-touch-startup-image',
        url: '/splash/apple-splash-2048-2732.jpg',
        media: '(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)'
      },
      {
        rel: 'apple-touch-startup-image',
        url: '/splash/apple-splash-1668-2388.jpg',
        media: '(device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)'
      },
      {
        rel: 'apple-touch-startup-image',
        url: '/splash/apple-splash-1536-2048.jpg',
        media: '(device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)'
      },
      {
        rel: 'apple-touch-startup-image',
        url: '/splash/apple-splash-1290-2796.jpg',
        media: '(device-width: 430px) and (device-height: 932px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)'
      },
      {
        rel: 'apple-touch-startup-image',
        url: '/splash/apple-splash-1179-2556.jpg',
        media: '(device-width: 393px) and (device-height: 852px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)'
      },
      {
        rel: 'apple-touch-startup-image',
        url: '/splash/apple-splash-1170-2532.jpg',
        media: '(device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)'
      },
      {
        rel: 'apple-touch-startup-image',
        url: '/splash/apple-splash-1125-2436.jpg',
        media: '(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)'
      },
    ],
  },
  manifest: '/manifest.json',
  appleWebApp: {
    title: 'Search',
    statusBarStyle: 'default',
    capable: true,
  },
};

export const viewport: Viewport = {
  themeColor: '#FCFCF9',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
