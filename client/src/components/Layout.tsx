import { Link, useLocation } from "wouter";
import { useTheme } from "@/components/ThemeProvider";
import { Sun, Moon, Heart, Home, Clock } from "lucide-react";
import PerplexityAttribution from "@/components/PerplexityAttribution";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { theme, toggle } = useTheme();
  const [location] = useLocation();

  const navItems = [
    { href: "/", label: "Generate", icon: Home },
    { href: "/favorites", label: "Favorites", icon: Heart },
    { href: "/history", label: "History", icon: Clock },
  ];

  return (
    <div className="min-h-dvh flex flex-col bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur-sm">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <svg viewBox="0 0 36 36" width="32" height="32" aria-label="NameVerse logo" fill="none">
              <rect width="36" height="36" rx="8" fill="hsl(220 60% 28%)" className="dark:fill-[hsl(42_85%_62%)]" />
              {/* Open book */}
              <path d="M7 24 C7 24 11 20 18 20 C25 20 29 24 29 24" stroke="white" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.4"/>
              <path d="M18 20 L18 10" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M7 12 C7 12 11 10 18 10" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M29 12 C29 12 25 10 18 10" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M7 12 L7 24" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M29 12 L29 24" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
              {/* Star */}
              <circle cx="27" cy="9" r="3.5" fill="hsl(42 85% 62%)" className="dark:fill-[hsl(220_60%_28%)]"/>
              <path d="M27 7.5 L27.4 8.6 L28.6 8.6 L27.7 9.3 L28 10.4 L27 9.8 L26 10.4 L26.3 9.3 L25.4 8.6 L26.6 8.6 Z" fill="white" />
            </svg>
            <div className="flex flex-col leading-none">
              <span className="text-sm font-bold tracking-tight text-foreground" style={{fontFamily:"var(--font-display)"}}>NameVerse</span>
              <span className="text-[10px] text-muted-foreground tracking-wide uppercase hidden sm:block">Bible Name Finder</span>
            </div>
          </Link>

          {/* Nav */}
          <nav className="flex items-center gap-1">
            {navItems.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  location === href
                    ? "bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                <Icon size={15} />
                <span className="hidden sm:inline">{label}</span>
              </Link>
            ))}
            <button
              onClick={toggle}
              aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
              className="ml-1 p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              data-testid="button-theme-toggle"
            >
              {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
            </button>
          </nav>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-4 px-4">
        <div className="max-w-2xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
          <span>© 2026 NameVerse · <a href="https://biblenamefinder.com" className="hover:text-foreground transition-colors">biblenamefinder.com</a></span>
          <PerplexityAttribution />
        </div>
      </footer>
    </div>
  );
}
