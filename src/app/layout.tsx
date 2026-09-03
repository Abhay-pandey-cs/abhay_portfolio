import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Abhay Pandey | Computer Science Student & Developer Portfolio',
  description: 'Personal engineering portfolio and technical learning journal of Abhay Pandey, 2nd-year B.Tech CSE student at Lovely Professional University (LPU). Building backend systems, IoT architectures, and exploring OS internals.',
  keywords: ['Abhay Pandey', 'Computer Science', 'LPU', 'Java Backend', 'Spring Boot', 'PostgreSQL', 'AidSphere', 'AgroSmart', 'ESP32', 'Operating Systems', 'Linux'],
  authors: [{ name: 'Abhay Pandey' }],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#121316] text-[#e2e4e9] min-h-screen antialiased selection:bg-[#007acc]/30 selection:text-white">
        {children}
      </body>
    </html>
  );
}
