import { useEffect } from "react";
import { Link } from "react-router-dom";
import { FileText, ArrowRight, HelpCircle, CheckCircle, Clock, Target, Search, PenTool, ListOrdered, Timer } from "lucide-react";
import { Footer } from "@/components/Footer";
import { useCanonical } from "@/hooks/useCanonical";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import heroImage from "@/assets/guide-mock-exams-hero.png";

const faqs = [
  {
    question: "How close should mock exams be to real exams?",
    answer: "Your mock exams don't need to perfectly replicate the real thing — that's often impossible without insider knowledge. What matters more is that they test the same skills: recall, understanding, and application of key concepts. Focus on matching the cognitive demand (how hard you have to think) rather than the exact format. If your professor has shared any guidance about exam structure — number of questions, time limits, question types — incorporate that. Otherwise, a reasonable approximation is better than no practice at all."
  },
  {
    question: "Can this work for different subjects?",
    answer: "Yes, the core method works across disciplines. For STEM subjects, emphasize problem-solving questions and calculations. For humanities and social sciences, focus on essay prompts and analytical questions. For professional courses (law, medicine, business), include case-based scenarios. The key principle — extracting concepts and converting them to questions — is universal, but the question formats should match your subject's conventions."
  },
  {
    question: "Is this effective for final exam preparation?",
    answer: "Very much so. Research on learning consistently shows that practice testing is one of the most effective study strategies. Creating your own mock exams doubles the benefit: the creation process forces you to identify what's important, and taking the exam tests your retrieval ability. For finals covering a full semester, this approach is particularly valuable because it helps you see connections across topics and identify gaps in your knowledge before the real exam."
  },
  {
    question: "How many mock exams should I create?",
    answer: "Quality matters more than quantity. One well-constructed mock exam that covers major topics is more valuable than five shallow ones. For a typical course, aim for 2–3 mock exams: one to identify your weak areas, one to practice those areas specifically, and one final comprehensive test under timed conditions. Adjust based on how much material your course covers and how much time you have."
  }
];

const mockExamQualities = [
  {
    icon: Target,
    color: "bg-primary",
    title: "Coverage of key topics",
    description: "Tests the major themes proportionally — not just what you find interesting or easy."
  },
  {
    icon: CheckCircle,
    color: "bg-amber-500",
    title: "Mix of question difficulty",
    description: "From basic recall to complex application. Easy questions build confidence; hard ones reveal gaps."
  },
  {
    icon: Clock,
    color: "bg-emerald-500",
    title: "Realistic time constraints",
    description: "Time pressure changes everything. Your mock should have a limit that creates similar pressure."
  }
];

const steps = [
  {
    icon: Search,
    title: "Review Notes and Identify Key Concepts",
    color: "bg-primary",
    description: "Go through all your materials and identify core concepts likely to be tested.",
    details: [
      "Definitions and key terminology",
      "Theories or frameworks your professor emphasized",
      "Processes with distinct steps or phases",
      "Relationships between concepts",
      "Anything marked as \"important\" or repeated"
    ]
  },
  {
    icon: PenTool,
    title: "Turn Concepts into Questions",
    color: "bg-amber-500",
    description: "For each concept, generate questions at different cognitive levels.",
    levels: [
      { name: "Knowledge/Recall", desc: "\"Define [term]\" or \"List the components of [concept]\"", color: "bg-emerald-500/10 text-emerald-600" },
      { name: "Comprehension", desc: "\"Explain why [X]\" or \"What is the relationship between [A] and [B]?\"", color: "bg-amber-500/10 text-amber-600" },
      { name: "Application", desc: "\"Given [scenario], how would you apply [concept]?\"", color: "bg-violet-500/10 text-violet-600" }
    ],
    tip: "Aim for roughly 30% recall, 40% understanding, and 30% application."
  },
  {
    icon: ListOrdered,
    title: "Organize Questions into Exam Format",
    color: "bg-violet-500",
    description: "Structure your questions to resemble a real exam.",
    guidelines: [
      { label: "Group by section", desc: "Match your real exam structure if known" },
      { label: "Assign point values", desc: "Helps prioritize during timed practice" },
      { label: "Order by difficulty", desc: "Place recall questions early, application later" },
      { label: "Match the length", desc: "Similar number of questions and time limit" }
    ]
  },
  {
    icon: Timer,
    title: "Simulate Exam Conditions",
    color: "bg-emerald-500",
    description: "Taking the mock under realistic conditions is key.",
    conditions: [
      { icon: "⏱", text: "Set a timer and stick to it" },
      { icon: "📵", text: "No notes or resources" },
      { icon: "🔇", text: "Find a quiet space" },
      { icon: "✍️", text: "Write full answers, don't just think through them" }
    ],
    tip: "After finishing, review your answers critically and note topics that need more study."
  }
];

export default function GuideMockExamsFromNotes() {
  useCanonical();
  
  useEffect(() => {
    document.title = "How to Create Mock Exams from Your Own Notes | ExamFromPDF";
    const metaDescription = document.querySelector('meta[name="description"]');
    const content = "Learn how to create effective mock exams from your lecture notes when past papers aren't available. A step-by-step guide for university students preparing for exams.";
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
            How to Create Mock Exams from Your Own Notes
          </h1>

          {/* Hero Image */}
          <figure className="mb-10">
            <img 
              src={heroImage} 
              alt="Illustration showing the transformation of personal study notes into structured mock exam papers with timer"
              className="w-full rounded-xl"
              loading="eager"
            />
          </figure>

          {/* Introduction */}
          <section className="mb-12">
            <p className="text-lg text-muted-foreground leading-relaxed">
              Mock exams are one of the most effective ways to prepare for a real exam. They force 
              you to retrieve information under pressure, reveal gaps in your knowledge, and build 
              familiarity with exam conditions.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              The problem is access. Many courses don't release past papers. The solution? Create 
              your own. The process itself is a powerful study technique.
            </p>
          </section>

          {/* What Makes a Good Mock Exam - Colorful Cards */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-6">
              What Makes a Good Mock Exam
            </h2>
            <div className="grid gap-4 sm:grid-cols-3">
              {mockExamQualities.map((quality, index) => (
                <div 
                  key={quality.title} 
                  className="rounded-xl border border-border bg-card p-5 text-center animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className={`h-14 w-14 mx-auto rounded-xl ${quality.color} flex items-center justify-center text-white shadow-lg mb-4`}>
                    <quality.icon className="h-7 w-7" />
                  </div>
                  <h3 className="font-semibold mb-2">{quality.title}</h3>
                  <p className="text-sm text-muted-foreground">{quality.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Step-by-Step Process - Colorful Cards */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-8">
              Step-by-Step: Creating Mock Exams from Your Notes
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
                      <ul className="list-disc pl-6 space-y-1 text-muted-foreground text-sm">
                        {step.details.map((detail) => (
                          <li key={detail}>{detail}</li>
                        ))}
                      </ul>
                    )}

                    {/* Question levels */}
                    {step.levels && (
                      <div className="space-y-2 mb-4">
                        {step.levels.map((level) => (
                          <div key={level.name} className={`rounded-lg p-3 ${level.color}`}>
                            <p className="font-medium text-sm">{level.name}</p>
                            <p className="text-xs opacity-80">{level.desc}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Guidelines */}
                    {step.guidelines && (
                      <div className="grid gap-2 sm:grid-cols-2">
                        {step.guidelines.map((guide) => (
                          <div key={guide.label} className="flex items-start gap-2 text-sm">
                            <span className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 shrink-0"></span>
                            <div>
                              <span className="font-medium">{guide.label}:</span>
                              <span className="text-muted-foreground ml-1">{guide.desc}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Exam conditions */}
                    {step.conditions && (
                      <div className="grid gap-2 sm:grid-cols-2 mb-4">
                        {step.conditions.map((cond) => (
                          <div key={cond.text} className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span className="text-lg">{cond.icon}</span>
                            {cond.text}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Tip */}
                    {step.tip && (
                      <p className="text-sm text-muted-foreground mt-4 pl-3 border-l-2 border-primary/30">
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
              Tools That Can Help
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-3">
              Creating mock exams manually is effective but time-consuming. If you're working with 
              PDF notes, some tools can automate the question-generation step.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              They won't replace understanding the material, but they can save hours of 
              question-writing time — especially when you have a lot of material to cover.
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
              Creating mock exams from your own notes takes effort, but it's effort that pays off 
              twice: once during creation (which deepens understanding) and again during practice 
              (which strengthens recall). If you don't have access to past papers, this is one of 
              the best alternatives available.
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
