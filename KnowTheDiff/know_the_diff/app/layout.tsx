import type { Metadata } from "next";
import { Ubuntu_Mono } from 'next/font/google';
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { DiffVaultNav } from "@/components/shared/DiffVaultNav";

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });



const ubuntuMono = Ubuntu_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],  // Optional: specify weights
  variable: '--font-ubuntu-mono',  // For Tailwind/CSS variables
  display: 'swap'  // Prevents invisible text during load
});

export const metadata: Metadata = {
  title: "DiffVault — Compare files and text",
  description:
    "Production-grade file and text comparison. Side-by-side or unified diff with Myers algorithm.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                var theme = localStorage.getItem('theme') || 'dark';
                if (theme === 'dark' || theme === 'light') {
                  document.documentElement.classList.add(theme);
                } else {
                  document.documentElement.classList.add('dark');
                }
              })();
            `,
          }}
        />
      </head>
      <body
        className={`${ubuntuMono.variable} font-mono min-h-screen bg-background text-foreground antialiased`}
      >
        <ThemeProvider>
          <DiffVaultNav />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
