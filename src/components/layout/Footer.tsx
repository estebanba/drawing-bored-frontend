import { Logotype } from "@/components/ui/logotype";
import { Link } from "react-router-dom";
import { Github, Twitter } from "lucide-react";

/**
 * A minimal, clean footer with essential navigation and information.
 * Columns aligned with space-between and last column right-aligned.
 */
export function Footer() {
  const currentYear = new Date().getFullYear();

  const productLinks = [
    { href: "/features", label: "Features" },
    { href: "/pricing", label: "Pricing" },
    { href: "/faq", label: "FAQ" },
    { href: "/blog", label: "Blog" },
  ];

  const companyLinks = [
    { href: "/about", label: "About" },
    { href: "mailto:support@example.com", label: "Support" },
  ];

  const legalLinks = [
    { href: "/privacy-policy", label: "Privacy" },
    { href: "/terms-of-service", label: "Terms" },
  ];

  return (
    <footer className="border-t">
      <div className="mx-auto w-full max-w-7xl px-6 py-12">
        {/* Main Footer Content */}
        <div className="flex justify-between">
          <div className="grid grid-cols-3 gap-16">
            {/* Product Links */}
            <div>
              <h4 className="text-sm font-medium mb-4">Product</h4>
              <nav className="flex flex-col space-y-3">
                {productLinks.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Company Links */}
            <div>
              <h4 className="text-sm font-medium mb-4">Company</h4>
              <nav className="flex flex-col space-y-3">
                {companyLinks.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href.startsWith('mailto:') ? link.href : link.href}
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Legal Links */}
            <div>
              <h4 className="text-sm font-medium mb-4">Legal</h4>
              <nav className="flex flex-col space-y-3">
                {legalLinks.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>
          </div>

          {/* Right-aligned Social Section */}
          <div className="text-right">
            <h4 className="text-sm font-medium mb-4">Connect</h4>
            <div className="flex justify-end space-x-4 mb-6">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground"
                aria-label="Twitter"
              >
                <Twitter className="h-4 w-4" />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground"
                aria-label="GitHub"
              >
                <Github className="h-4 w-4" />
              </a>
            </div>
            <p className="text-xs text-muted-foreground">
              Built for developers<br />by developers
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between pt-8 mt-8 border-t gap-4">
          <Link to="/" className="flex items-center space-x-3">
            <Logotype />
            <span className="text-sm font-medium">Boilerplate</span>
          </Link>
          <p className="text-sm text-muted-foreground">
            © {currentYear} Your Company. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
} 