import { useEffect } from "react";
import { Link } from "react-router-dom";
import { FileText, ArrowRight, HelpCircle, XCircle, FolderOpen, Target, PenTool, Brain, Layers } from "lucide-react";
import { Footer } from "@/components/Footer";
import { useCanonical } from "@/hooks/useCanonical";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import heroImage from "@/assets/guide-study-semester-hero.png";

const faqs = [
  {
    question: "How many weeks before finals should I start?",
    answer: "Ideally, 3–4 weeks before your exam period. This gives you enough time to work through all your lecture materials systematically without cramming. If you have less time, prioritize: focus on lectures your professor emphasized, topics that appear repeatedly, and areas where you feel least confident. Even one week of structured study using this method is more effective than passive re-reading."
  },
  {
    question: "Is this method useful without past exams?",
    answer: "Yes. While past exams are helpful for understanding question format and difficulty, the core of this method — extracting concepts and testing yourself — works independently. In fact, creating your own questions forces deeper engagement with the material than simply solving past papers. Many students rely too heavily on past exams and struggle when questions are phrased differently."
  },
  {
    question: "Does it work for textbook PDFs as well?",
    answer: "Absolutely. Textbook chapters tend to be more detailed than lecture slides, which means more material to process but also richer content for generating practice questions. The same principles apply: identify key concepts, convert them to questions, and test yourself. For textbooks, pay special attention to chapter summaries, bolded terms, and end-of-chapter review questions as guides for what's important."
  },
  {
    question: "What if I have 50+ lecture PDFs to review?",
    answer: "Start by grouping them into topics or modules — most courses have 4–6 major themes. Then prioritize: which topics carry more weight on the exam? Which do you understand least? You don't need to create questions for every slide. Focus on core concepts, and trust that understanding fundamentals will help you handle variations in exam questions."
  }
];

const mistakes = [
  {
    icon: XCircle,
    title: "Reading without testing",
    description: "Recognition (\"I've seen this before\") is not the same as recall. Without active testing, you're building familiarity, not knowledge."
  },
  {
    icon: XCircle,
    title: "Studying everything equally",
    description: "Not all content is equally examinable. Treating everything the same wastes time on low-priority material."
  },
  {
    icon: XCircle,
    title: "Not converting content into practice",
    description: "Lecture PDFs are passive materials. The gap between reading and answering exam questions is larger than students realize."
  },
  {
    icon: XCircle,
    title: "Leaving revision to the final week",
    description: "Cramming leads to shallow understanding. Spaced study creates stronger, longer-lasting memory traces."
  }
];

const steps = [
  {
    icon: FolderOpen,
    title: "Organize Your PDFs by Topic",
    color: "bg-primary",
    description: "Before studying content, create structure.",
    details: [
      "Group related lectures together (e.g., \"Weeks 1–3: Foundations\")",
      "Create a simple map of how topics connect",
      "Identify foundational vs. advanced topics",
      "Note topics your professor emphasized"
    ],
    time: "30–60 minutes"
  },
  {
    icon: Target,
    title: "Extract Examinable Concepts",
    color: "bg-amber-500",
    description: "Identify what's actually testable. Not everything on a slide is exam material.",
    comparison: {
      likely: ["Definitions of key terms", "Core theories or models", "Processes with distinct steps", "Comparisons between concepts"],
      unlikely: ["Historical background", "Tangential anecdotes", "Administrative slides", "Overly detailed examples"]
    }
  },
  {
    icon: PenTool,
    title: "Turn Content into Self-Test Questions",
    color: "bg-violet-500",
    description: "For each concept, create questions at different levels.",
    levels: [
      { name: "Recall", example: "\"Define X\" or \"What are the three types of Y?\"" },
      { name: "Understanding", example: "\"Why does X happen?\" or \"How does A relate to B?\"" },
      { name: "Application", example: "\"Given this scenario, which approach would you use?\"" }
    ]
  },
  {
    icon: Brain,
    title: "Review with Active Recall",
    color: "bg-emerald-500",
    description: "Test before you review. Struggling to recall strengthens memory.",
    tips: [
      "Try to answer each question from memory before looking at notes",
      "Space your practice — alternate between topics",
      "Focus on what you got wrong",
      "Explain out loud to reveal gaps"
    ]
  },
  {
    icon: Layers,
    title: "Integrate Across Topics",
    color: "bg-sky-500",
    description: "As you get closer to the exam, practice questions that connect multiple topics.",
    tip: "Real exam questions often require you to synthesize knowledge from different parts of the course."
  }
];

export default function GuideStudySemesterPDFs() {
  useCanonical();
  
  useEffect(() => {
    document.title = "How to Study a Whole Semester Using Lecture PDFs | ExamFromPDF";
    const metaDescription = document.querySelector('meta[name="description"]');
    const content = "A practical guide for university students on how to systematically study an entire semester of lecture PDFs for midterms and finals. Structured approach with actionable steps.";
    if (metaDescription) {
      metaDescription.setAttribute("content", content);
    } else {
      const meta = document.createElement("meta");
      meta.name = "description";
      meta.content = content;
      document.head.appendChild(meta);
    }
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex h-16 max-w-3xl items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/70">
              <div className="relative flex items-center">
                <FileText className="h-4 w-4 text-primary-foreground" />
                <ArrowRight className="h-3 w-3 text-primary-foreground -ml-0.5" />
              </div>
            </div>
            <span className="text-lg font-semibold">ExamFromPDF</span>
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-12">
        <article className="max-w-none">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl mb-6">
            How to Study a Whole Semester Using Lecture PDFs
          </h1>

          {/* Hero Image */}
          <figure className="mb-10">
            <img 
              src={heroImage} 
              alt="Visual guide showing how to organize and study multiple lecture PDFs for semester exam preparation"
              className="w-full rounded-xl"
              loading="eager"
            />
          </figure>

          {/* Introduction */}
          <section className="mb-12">
            <p className="text-lg text-muted-foreground leading-relaxed">
              It's three weeks before finals. You open your course folder and find 40 lecture PDFs, 
              each with 30–60 slides. That's over a thousand slides of content.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              The good news: there's a systematic way to approach this. It won't make the work 
              disappear, but it will make your effort more effective.
            </p>
          </section>

          {/* Common Mistakes - Grid of Red Cards */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-6">
              Common Mistakes When Studying from PDFs
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {mistakes.map((mistake, index) => (
                <div 
                  key={mistake.title} 
                  className="rounded-xl border border-destructive/20 bg-destructive/5 p-4 animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-start gap-3">
                    <div className="shrink-0 h-8 w-8 rounded-lg bg-destructive/20 flex items-center justify-center">
                      <mistake.icon className="h-4 w-4 text-destructive" />
                    </div>
                    <div>
                      <h3 className="font-medium text-sm mb-1">{mistake.title}</h3>
                      <p className="text-xs text-muted-foreground">{mistake.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Structured Approach - Colorful Step Cards */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-8">
              A Structured Approach to Semester-Wide Study
            </h2>

            <div className="space-y-8">
              {steps.map((step, index) => (
                <div 
                  key={step.title} 
                  className="relative rounded-xl border border-border bg-card p-6 animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Step indicator */}
                  <div className="absolute -top-4 left-6 flex items-center gap-3">
                    <div className={`h-12 w-12 rounded-xl ${step.color} flex items-center justify-center text-white shadow-lg`}>
                      <step.icon className="h-6 w-6" />
                    </div>
                    <span className="text-xs font-medium text-muted-foreground bg-background px-2">
                      Step {index + 1}
                    </span>
                  </div>

                  <div className="pt-6">
                    <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                    <p className="text-muted-foreground mb-4">{step.description}</p>

                    {/* Details list */}
                    {step.details && (
                      <>
                        <ul className="list-disc pl-6 space-y-1 text-muted-foreground text-sm mb-3">
                          {step.details.map((detail) => (
                            <li key={detail}>{detail}</li>
                          ))}
                        </ul>
                        {step.time && (
                          <p className="text-xs text-primary font-medium">⏱ Takes about {step.time}</p>
                        )}
                      </>
                    )}

                    {/* Comparison grid */}
                    {step.comparison && (
                      <div className="grid gap-3 sm:grid-cols-2">
                        <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-3">
                          <p className="font-medium text-emerald-600 dark:text-emerald-400 text-sm mb-2">✓ Likely examinable</p>
                          <ul className="text-xs text-muted-foreground space-y-1">
                            {step.comparison.likely.map((item) => (
                              <li key={item}>• {item}</li>
                            ))}
                          </ul>
                        </div>
                        <div className="rounded-lg bg-muted/50 border border-border p-3">
                          <p className="font-medium text-muted-foreground text-sm mb-2">✗ Less likely</p>
                          <ul className="text-xs text-muted-foreground space-y-1">
                            {step.comparison.unlikely.map((item) => (
                              <li key={item}>• {item}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}

                    {/* Question levels */}
                    {step.levels && (
                      <div className="grid gap-2 sm:grid-cols-3">
                        {step.levels.map((level) => (
                          <div key={level.name} className="rounded-lg bg-muted/50 p-3 text-sm">
                            <p className="font-medium mb-1">{level.name}</p>
                            <p className="text-xs text-muted-foreground">{level.example}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Tips list */}
                    {step.tips && (
                      <ul className="space-y-2 text-sm">
                        {step.tips.map((tip) => (
                          <li key={tip} className="flex items-start gap-2 text-muted-foreground">
                            <span className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 shrink-0"></span>
                            {tip}
                          </li>
                        ))}
                      </ul>
                    )}

                    {/* Single tip */}
                    {step.tip && (
                      <p className="text-sm text-muted-foreground pl-3 border-l-2 border-primary/30">
                        {step.tip}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Tools Section */}
          <section className="mb-12 rounded-xl border border-primary/20 bg-primary/5 p-6">
            <h2 className="text-xl font-semibold mb-3">
              Using Tools to Speed Up the Process
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-3">
              The method above is effective but time-intensive. If you're short on time, there 
              are tools that can help automate the question-creation step.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Some applications can analyze PDF documents and generate practice questions 
              automatically — letting you focus more energy on actually practicing and learning.
            </p>
          </section>

          {/* FAQ Section */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
              <HelpCircle className="h-6 w-6 text-primary" />
              Frequently Asked Questions
            </h2>
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left text-base font-medium">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>

          {/* Closing */}
          <section className="border-t border-border pt-8">
            <p className="text-muted-foreground leading-relaxed">
              Studying a whole semester of lecture PDFs is a significant undertaking. But a 
              structured approach — organizing first, extracting what matters, converting to 
              questions, and testing yourself actively — makes that work far more effective. 
              Start earlier than you think you need to, and trust the process.
            </p>
          </section>
        </article>
      </main>

      <Footer />

      {/* FAQ Schema for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": faqs.map(faq => ({
              "@type": "Question",
              "name": faq.question,
              "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.answer
              }
            }))
          })
        }}
      />
    </div>
  );
}
