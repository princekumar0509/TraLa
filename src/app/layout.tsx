import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'TraLa — Smart Attendance for Field Teams',
  description:
    'A mobile-first labour attendance management app for supervisors and contractors. Mark attendance, track wages, and manage your workforce with ease.',
  keywords: ['labour attendance', 'worker management', 'construction attendance', 'site manager'],
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
    shortcut: '/favicon.ico',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'TraLa',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#4f46e5',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-gray-50 text-gray-900 antialiased">
        {children}
        <Toaster
            position="top-center"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#1e293b',
                color: '#f8fafc',
                borderRadius: '16px',
                padding: '12px 16px',
                fontSize: '14px',
                fontWeight: '500',
                maxWidth: '380px',
                boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
              },
              success: {
                iconTheme: { primary: '#22c55e', secondary: '#f8fafc' },
              },
              error: {
                iconTheme: { primary: '#ef4444', secondary: '#f8fafc' },
              },
            }}
          />
      </body>
    </html>
  );
}
