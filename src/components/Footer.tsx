import { FileText, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/30 py-12">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex flex-col items-center justify-between gap-8 sm:flex-row sm:items-start">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/70">
              <div className="relative flex items-center">
                <FileText className="h-3.5 w-3.5 text-primary-foreground" />
                <ArrowRight className="h-2.5 w-2.5 text-primary-foreground -ml-0.5" />
              </div>
            </div>
            <span className="text-lg font-semibold">ExamFromPDF</span>
          </div>

          {/* Use Cases */}
          <div className="flex flex-col items-center gap-2 sm:items-start">
            <span className="text-sm font-medium text-foreground">Use Cases</span>
            <nav className="flex flex-col items-center gap-1.5 text-sm text-muted-foreground sm:items-start">
              <Link to="/use-case/lecture-pdfs" className="transition-colors hover:text-foreground">
                Practice Exams from Lecture PDFs
              </Link>
              <Link to="/use-case/textbook-pdfs" className="transition-colors hover:text-foreground">
                Practice Exams from Textbook PDFs
              </Link>
            </nav>
          </div>

          {/* Links */}
          <nav className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
            <a href="#how-it-works" className="transition-colors hover:text-foreground">
              How It Works
            </a>
            <a href="#features" className="transition-colors hover:text-foreground">
              Features
            </a>
            <a href="#pricing" className="transition-colors hover:text-foreground">
              Pricing
            </a>
            <a href="#faq" className="transition-colors hover:text-foreground">
              FAQ
            </a>
            <a href="/privacy" className="transition-colors hover:text-foreground">
              Privacy Policy
            </a>
            <a href="/terms" className="transition-colors hover:text-foreground">
              Terms of Service
            </a>
          </nav>

          {/* Contact & Copyright */}
          <div className="flex flex-col items-center gap-2 sm:items-end text-sm text-muted-foreground">
            <a href="mailto:examfrompdf2026@gmail.com" className="transition-colors hover:text-foreground">
              examfrompdf2026@gmail.com
            </a>
            <p>© {new Date().getFullYear()} ExamFromPDF</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
