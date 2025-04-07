import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'FSearch - Powered by Gemini AI',
  description: 'Search with Gemini AI and get reliable answers with sources',
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
