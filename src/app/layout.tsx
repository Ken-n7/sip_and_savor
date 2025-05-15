// app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import { ThemeProvider } from './components/common/ThemeProvider';

const inter = Inter({ subsets: ['latin'] });

// Determine API domains for preconnect
const cocktailDomain = process.env.NEXT_PUBLIC_COCKTAILDB_API
  ? new URL(process.env.NEXT_PUBLIC_COCKTAILDB_API).origin
  : "https://www.thecocktaildb.com";

const mealDomain = process.env.NEXT_PUBLIC_MEALDB_API
  ? new URL(process.env.NEXT_PUBLIC_MEALDB_API).origin
  : "https://www.themealdb.com";

export const metadata: Metadata = {
  title: 'Food & Drink Explorer | Discover Recipes',
  description: 'Explore thousands of cocktail and meal recipes from around the world',
  // Add preconnect links to improve performance
  other: {
    // Using the metadata API to add preconnect links
    preconnect: [
      cocktailDomain,
      mealDomain
    ]
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className}`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-200">
            <Header />
            <main className="flex-grow">{children}</main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}