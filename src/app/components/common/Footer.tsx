'use client';

import Link from 'next/link';

const companyLinks = [
  { name: 'ThecocktailDB', href: 'https://www.thecocktaildb.com', external: true },
  { name: 'TheMealDB', href: 'https://www.themealdb.com', external: true },
];

const Footer = () => {
  return (
    <footer className="bg-background border-t border-border mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between gap-8">
          {/* Brand info */}
          <div className="space-y-4">
            <Link
              href="/"
              className="inline-block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
              aria-label="Home"
            >
              <span className="text-xl font-bold text-foreground">SipAndSavor</span>
            </Link>
            <p className="text-foreground/70 text-sm max-w-xs">
              Discover world recipes with minimal distractions.
            </p>
          </div>

          {/* Company links */}
          <div className="space-y-3">
            <h3 className="text-xs font-medium uppercase tracking-wider text-foreground/70">
              Data Sources
            </h3>
            <ul className="space-y-2">
              {companyLinks.map((link) => (
                <li key={link.name}>
                  {link.external ? (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block py-2 text-sm text-foreground/70 hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:rounded"
                    >
                      {link.name}
                    </a>
                  ) : (
                    <Link
                      href={link.href}
                      className="inline-block py-2 text-sm text-foreground/70 hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:rounded"
                      prefetch={false}
                    >
                      {link.name}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-border">
          <p suppressHydrationWarning className="text-xs text-foreground/70">
            © {new Date().getFullYear()} SipAndSavor
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
