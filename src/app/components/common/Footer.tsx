import Link from 'next/link';
import { FaGithub, FaTwitter, FaInstagram, FaYoutube } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  // Memoized footer data to prevent unnecessary re-renders
  const footerLinks = [
    {
      title: 'Explore',
      links: [
        { name: 'Cocktails', href: '/cocktails' },
        { name: 'Meals', href: '/meals' },
        { name: 'Categories', href: '/categories' },
      ],
    },
    {
      title: 'Company',
      links: [
        { name: 'About', href: '/about' },
        { name: 'Contact', href: '/contact' },
        { name: 'Privacy', href: '/privacy' },
      ],
    },
  ];

  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand info - More prominent */}
          <div className="space-y-4 md:col-span-1">
            <Link 
              href="/" 
              className="inline-block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
              aria-label="Home"
            >
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                RecipeExplorer
              </span>
            </Link>
            <p className="text-gray-500 dark:text-gray-400 text-sm max-w-xs">
              Discover world recipes with minimal distractions.
            </p>
          </div>

          {/* Consolidated footer links - More scannable */}
          <div className="grid grid-cols-2 gap-8 md:col-span-2">
            {footerLinks.map((column) => (
              <div key={column.title} className="space-y-3">
                <h3 className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                  {column.title}
                </h3>
                <ul className="space-y-2">
                  {column.links.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:rounded"
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

        {/* Bottom footer - Simplified */}
        <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800 flex flex-col md:flex-row justify-between items-center space-y-3 md:space-y-0">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            © {currentYear} RecipeExplorer
          </p>
          <div className="flex space-x-4">
            <Link
              href="/terms"
              className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:rounded px-1"
              prefetch={false}
            >
              Terms
            </Link>
            <Link
              href="/privacy"
              className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:rounded px-1"
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