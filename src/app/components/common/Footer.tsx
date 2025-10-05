'use client';

import Link from 'next/link';

// Pre-defined footer links - moved outside component to avoid re-creation
const footerLinks = [
  // {
  //   title: 'Explore',
  //   links: [
  //     { name: 'Cocktails', href: '/cocktails' },
  //     { name: 'Meals', href: '/meals' },
  //     { name: 'Categories', href: '/categories' },
  //   ],
  // },
  // {
  //   title: 'Company',
  //   links: [
  //     { name: 'About', href: '/about' },
  //     { name: 'Contact', href: '/contact' },
  //     { name: 'Privacy', href: '/privacy' },
  //   ],
  // },
];

const Footer = () => {
  
  
  // Get current year for copyright - will be stable during server render and hydration
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-background border-t border-border mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand info */}
          <div className="space-y-4 md:col-span-1">
            <Link 
              href="/" 
              className="inline-block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
              aria-label="Home"
            >
              <span className="text-xl font-bold text-foreground">
                SipAndSavor
              </span>
            </Link>
            <p className="text-foreground/70 text-sm max-w-xs">
              Discover world recipes with minimal distractions.
            </p>
          </div>

          {/* Footer links */}
          <div className="grid grid-cols-2 gap-8 md:col-span-2">
            {footerLinks.map((column) => (
              <div key={column.title} className="space-y-3">
                <h3 className="text-xs font-medium uppercase tracking-wider text-foreground/70">
                  {column.title}
                </h3>
                <ul className="space-y-2">
                  {column.links.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className="text-sm text-foreground/70 hover:text-foreground transition-colors 
                                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary 
                                  focus-visible:rounded"
                        prefetch={false}
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom footer */}
        <div className="mt-8 pt-6 border-t border-border flex flex-col md:flex-row justify-between items-center space-y-3 md:space-y-0">  
          <p className="text-xs text-foreground/70">
            © {currentYear} SipAndSavor
          </p>
          <div className="flex space-x-4">
            <Link
              href="/terms"
              className="text-xs text-foreground/70 hover:text-foreground transition-colors 
                        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary 
                        focus-visible:rounded px-1"
              prefetch={false}
            >
              Terms
            </Link>
            <Link
              href="/privacy"
              className="text-xs text-foreground/70 hover:text-foreground transition-colors 
                        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary 
                        focus-visible:rounded px-1"
              prefetch={false}
            >
              Privacy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
