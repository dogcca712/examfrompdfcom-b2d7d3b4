import { useEffect } from "react";
import { FileText, ArrowRight, Upload, Sparkles, Download, GraduationCap, BookOpen, Users, Clock, CheckCircle, Target, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Footer } from "@/components/Footer";
import { useCanonical } from "@/hooks/useCanonical";

const steps = [
  {
    icon: Upload,
    title: "Upload Your Textbook PDF",
    description: "Upload any textbook chapter or study guide in PDF format. The AI extracts key concepts to build your practice exam.",
  },
  {
    icon: Sparkles,
    title: "AI Generates Your Practice Exam",
    description: "Our AI exam generator reads your textbook content and creates a tailored practice exam with multiple choice, short answer, and essay questions.",
  },
  {
    icon: Download,
    title: "Download Your Practice Exam PDF",
    description: "Get a professionally formatted practice exam based on your textbook — ready for chapter reviews or comprehensive study sessions.",
  },
];

const audiences = [
  {
    icon: GraduationCap,
    title: "Students",
    description: "Turn dense textbook chapters into manageable practice tests to prepare for exams at your own pace.",
  },
  {
    icon: BookOpen,
    title: "Educators",
    description: "Generate chapter quizzes and assessments directly from assigned textbook readings.",
  },
  {
    icon: Users,
    title: "Self-Learners",
    description: "Study any subject independently and test your understanding of textbook material as you progress.",
  },
];

const benefits = [
  {
    icon: Clock,
    title: "Study Faster, Not Harder",
    description: "Our practice test maker turns lengthy textbook chapters into focused practice exams in minutes.",
  },
  {
    icon: Target,
    title: "Questions Based on Your Textbook",
    description: "Every question is generated from your specific textbook PDF — not generic content from elsewhere.",
  },
  {
    icon: CheckCircle,
    title: "No Signup Required",
    description: "Start generating practice exams from your textbook PDFs immediately. No account needed.",
  },
];

const scenarios = [
  {
    title: "Chapter Reviews",
    description: "Upload individual textbook chapters after reading them to generate practice exams that reinforce key concepts.",
  },
  {
    title: "Midterm & Final Prep",
    description: "Combine multiple chapters into one PDF and generate comprehensive practice exams to prepare for big tests.",
  },
  {
    title: "Self-Paced Learning",
    description: "Studying on your own schedule? Generate exams from textbooks to track your progress and identify weak areas.",
  },
];

export default function UseCaseTextbookPDFs() {
  useCanonical();
  useEffect(() => {
    document.title = "Create Practice Exams from Textbook PDFs | ExamFromPDF";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", "Generate practice exams from textbook PDFs with AI. Upload any textbook chapter and get a ready-to-use practice test in minutes — no signup required.");
    } else {
      const meta = document.createElement("meta");
      meta.name = "description";
      meta.content = "Generate practice exams from textbook PDFs with AI. Upload any textbook chapter and get a ready-to-use practice test in minutes — no signup required.";
      document.head.appendChild(meta);
    }
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
          <a href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/70">
              <div className="relative flex items-center">
                <FileText className="h-4 w-4 text-primary-foreground" />
                <ArrowRight className="h-3 w-3 text-primary-foreground -ml-0.5" />
              </div>
            </div>
            <span className="text-lg font-semibold">ExamFromPDF</span>
          </a>
          <Button asChild>
            <a href="/">Try It Free</a>
          </Button>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="py-16 px-4 sm:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              Create Practice Exams from Textbook PDFs
            </h1>
            <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
              Textbooks are packed with information, but turning chapters into effective study material 
              takes time. With ExamFromPDF, you can generate practice exams from textbook PDFs in minutes. 
              Our AI exam generator reads your textbook content and creates practice tests tailored to 
              what you're studying — chapter by chapter.
            </p>
            <div className="mt-8">
              <Button size="lg" asChild>
                <a href="/">Generate Exams from Textbooks →</a>
              </Button>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16 px-4 bg-muted/30">
          <div className="mx-auto max-w-5xl">
            <h2 className="text-2xl font-bold text-center sm:text-3xl mb-12">
              How It Works
            </h2>
            <div className="grid gap-8 md:grid-cols-3">
              {steps.map((step, index) => (
                <div key={step.title} className="relative text-center pt-6">
                  <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                    <step.icon className="h-6 w-6" />
                  </div>
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 text-xs font-medium text-muted-foreground">
                    Step {index + 1}
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Who This Is For */}
        <section className="py-16 px-4">
          <div className="mx-auto max-w-5xl">
            <h2 className="text-2xl font-bold text-center sm:text-3xl mb-12">
              Who This Is For
            </h2>
            <div className="grid gap-6 md:grid-cols-3">
              {audiences.map((audience) => (
                <div key={audience.title} className="rounded-xl border border-border bg-card p-6">
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <audience.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{audience.title}</h3>
                  <p className="text-sm text-muted-foreground">{audience.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why Use ExamFromPDF */}
        <section className="py-16 px-4 bg-muted/30">
          <div className="mx-auto max-w-5xl">
            <h2 className="text-2xl font-bold text-center sm:text-3xl mb-4">
              Why Use ExamFromPDF
            </h2>
            <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
              Reading textbooks is one thing — testing yourself is another. Our practice test maker 
              generates exams directly from your textbook PDFs so you can study smarter.
            </p>
            <div className="grid gap-6 md:grid-cols-3">
              {benefits.map((benefit) => (
                <div key={benefit.title} className="flex gap-4">
                  <div className="shrink-0">
                    <div className="h-10 w-10 rounded-lg bg-success/10 flex items-center justify-center text-success">
                      <benefit.icon className="h-5 w-5" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">{benefit.title}</h3>
                    <p className="text-sm text-muted-foreground">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Example Use Scenarios */}
        <section className="py-16 px-4">
          <div className="mx-auto max-w-5xl">
            <h2 className="text-2xl font-bold text-center sm:text-3xl mb-4">
              Example Use Scenarios
            </h2>
            <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
              See how students and educators use our AI exam generator to create practice exams from 
              textbook materials.
            </p>
            <div className="grid gap-6 md:grid-cols-3">
              {scenarios.map((scenario, index) => (
                <div key={scenario.title} className="rounded-xl border border-border bg-card p-6">
                  <div className="mb-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-semibold">
                    {index + 1}
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{scenario.title}</h3>
                  <p className="text-sm text-muted-foreground">{scenario.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-4 bg-primary/5">
          <div className="mx-auto max-w-2xl text-center">
            <Lightbulb className="h-10 w-10 text-primary mx-auto mb-4" />
            <h2 className="text-2xl font-bold sm:text-3xl mb-4">
              Ready to Generate Practice Exams from Your Textbooks?
            </h2>
            <p className="text-muted-foreground mb-8">
              Upload a textbook chapter and see how easy it is to create practice tests from your study materials.
            </p>
            <Button size="lg" asChild>
              <a href="/">Start Now — No Signup Required</a>
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
