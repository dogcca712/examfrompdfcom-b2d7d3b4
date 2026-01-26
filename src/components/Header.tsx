import { FileText, ArrowRight, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

const navItems = [
  { label: "How It Works", href: "#how-it-works" },
  { label: "Features", href: "#features" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
];

interface HeaderProps {
  onMenuClick?: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-30 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left: Menu button + Logo */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="h-11 w-11"
            onClick={onMenuClick}
          >
            <Menu className="h-6 w-6" />
          </Button>
          
          <a href="/" className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/70 shadow-sm">
              <div className="relative flex items-center">
                <FileText className="h-5 w-5 text-primary-foreground" />
                <ArrowRight className="h-4 w-4 text-primary-foreground -ml-1" />
              </div>
            </div>
            <span className="text-2xl font-bold tracking-tight">ExamFromPDF</span>
          </a>
        </div>

        {/* Center: Navigation - hidden on mobile */}
        <nav className="hidden items-center gap-10 lg:flex">
          {navItems.map((item) => (
            <button
              key={item.href}
              onClick={() => scrollToSection(item.href)}
              className="text-base font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Right: empty for balance */}
        <div className="w-11 lg:w-0" />
      </div>
    </header>
  );
}
