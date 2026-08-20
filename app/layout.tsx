import type { Metadata, Viewport } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from 'sonner';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
});

export const viewport: Viewport = {
  themeColor: '#2563EB',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: 'SecurePass | Generate Strong Passwords. Stay Secure.',
  description:
    'Generate Strong Passwords. Stay Secure. Create cryptographically secure passwords, EFF Diceware passphrases, quantum-resistant tokens, and PIN codes entirely client-side with WebCrypto CSPRNG.',
  keywords: [
    'SecurePass',
    'password generator',
    'passphrase generator',
    'diceware',
    'csprng',
    'webcrypto',
    'zero-trust',
    'security studio',
    'entropy calculator',
  ],
  authors: [{ name: 'SecurePass Security' }],
  openGraph: {
    title: 'SecurePass | Generate Strong Passwords. Stay Secure.',
    description:
      'Client-side cryptographically secure password & passphrase studio with live entropy analytics and air-gapped QR transfer.',
    url: 'https://securepass.vercel.app',
    siteName: 'SecurePass',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SecurePass | Generate Strong Passwords. Stay Secure.',
    description: 'Modern password generation for everyone. Simple. Secure. Reliable.',
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/icon', type: 'image/png', sizes: '64x64' },
    ],
    apple: [{ url: '/apple-icon', sizes: '180x180', type: 'image/png' }],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="font-sans antialiased bg-slate-950 text-slate-100">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster
            position="bottom-right"
            theme="dark"
            richColors
            closeButton
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
