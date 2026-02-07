import { useEffect } from "react";
import { Link } from "react-router-dom";
import { FileText, ArrowRight, HelpCircle, Search, PenTool, Shuffle, Clock, RefreshCw } from "lucide-react";
import { Footer } from "@/components/Footer";
import { useCanonical } from "@/hooks/useCanonical";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import heroImage from "@/assets/guide-slides-to-questions-hero.png";

const faqs = [
  {
    question: "Can I create practice questions without past exam papers?",
    answer: "Yes. Past papers are helpful but not essential. The method described above works entirely from your lecture slides. By identifying key concepts, terminology, and relationships in your slides, you can create meaningful practice questions without ever seeing a real exam. In fact, this approach often helps you discover gaps in your understanding that past papers might miss."
  },
  {
    question: "Does this work for lecture PDFs or textbook PDFs?",
    answer: "Both. Lecture slides tend to be more condensed and concept-focused, making them ideal for generating recall and definition questions. Textbook chapters contain more depth and examples, which lend themselves to application and analysis questions. You can use the same step-by-step method for either — just adjust your expectations: slides give you breadth, textbooks give you depth."
  },
  {
    question: "Is this useful for final exam revision?",
    answer: "Absolutely. Creating practice questions is one of the most effective revision strategies according to learning science research. It forces you to engage actively with the material rather than passively re-reading. For final exams covering multiple topics, working through your slides systematically to generate questions also helps you identify which areas need more attention."
  },
  {
    question: "How many practice questions should I create per lecture?",
    answer: "A reasonable target is 5–10 questions per lecture, covering a mix of recall, understanding, and application. You don't need to be exhaustive — the goal is active engagement, not completeness. Focus on concepts your professor emphasized or topics that appear across multiple lectures, as these are more likely to be examined."
  }
];

const steps = [
  {
    icon: Search,
    title: "Identify the Key Concepts",
    color: "bg-primary",
    description: "Go through each slide and extract the core ideas.",
    details: [
      "Definitions of terms or concepts",
      "Processes or sequences (steps, stages, phases)",
      "Comparisons or contrasts between ideas",
      "Cause-and-effect relationships",
      "Examples that illustrate broader principles",
      "Anything the professor emphasized verbally or visually"
    ],
    tip: "Write these down in a simple list. Don't worry about question format yet — just capture the raw material."
  },
  {
    icon: PenTool,
    title: "Convert Concepts into Questions",
    color: "bg-amber-500",
    description: "Transform each concept into questions at different levels.",
    questionTypes: [
      { type: "Recall questions", example: '"What is [term]?" or "List the three stages of [process]."', desc: "These test basic memory and are often the foundation for harder questions." },
      { type: "Understanding questions", example: '"Explain why [X] leads to [Y]" or "What is the difference between [A] and [B]?"', desc: "These require you to demonstrate comprehension, not just memorization." },
      { type: "Application questions", example: '"Given [scenario], how would you apply [concept]?"', desc: "These test your ability to use knowledge in new situations." }
    ]
  },
  {
    icon: Shuffle,
    title: "Mix Question Formats",
    color: "bg-violet-500",
    description: "Vary how you phrase questions to prepare for different exam formats.",
    formats: [
      { name: "Multiple choice", desc: "Create a correct answer and 2–3 plausible distractors" },
      { name: "Short answer", desc: "Questions requiring 1–3 sentence responses" },
      { name: "Essay prompts", desc: "Broader questions requiring structured arguments" },
      { name: "True/False", desc: "Statements to evaluate (include some false ones)" }
    ]
  },
  {
    icon: Clock,
    title: "Test Yourself with Spacing",
    color: "bg-emerald-500",
    description: "Don't answer questions immediately after creating them.",
    tip: "Wait at least a day, then attempt them without looking at your slides. This spaced retrieval practice is one of the most effective learning techniques supported by cognitive science research."
  },
  {
    icon: RefreshCw,
    title: "Review and Refine",
    color: "bg-sky-500",
    description: "After testing yourself, note which questions you struggled with.",
    tip: "These indicate areas needing more review. You can also refine your questions — if one was too easy or poorly worded, improve it for next time."
  }
];

const pitfalls = [
  { title: "Re-reading slides creates false confidence", desc: "Recognition is not the same as recall. On an exam, you need to retrieve from memory without prompts." },
  { title: "Passive highlighting doesn't build understanding", desc: "Highlighting feels productive but requires minimal cognitive effort." },
  { title: "It's hard to identify what's actually examinable", desc: "Without practice questions, it's difficult to know what level of detail you'll need." }
];

export default function GuideSlidesPracticeQuestions() {
  useCanonical();
  
  useEffect(() => {
    document.title = "How to Turn Lecture Slides into Practice Questions | ExamFromPDF";
    const metaDescription = document.querySelector('meta[name="description"]');
    const content = "Learn a step-by-step method to convert your lecture slides into effective practice questions for exam preparation. Practical tips for university students.";
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
            How to Turn Lecture Slides into Practice Questions
          </h1>

          {/* Hero Image */}
          <figure className="mb-10">
            <img 
              src={heroImage} 
              alt="Step-by-step process of converting lecture slides into practice exam questions for effective study"
              className="w-full rounded-xl"
              loading="eager"
            />
          </figure>

          {/* Opening Section */}
          <section className="mb-12">
            <p className="text-lg text-muted-foreground leading-relaxed">
              If you're a university student preparing for exams, you've probably experienced this: 
              you have dozens of lecture slides covering weeks of material, but almost no practice 
              questions to test yourself with.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              This guide walks through a systematic approach to transform passive study materials 
              into active practice questions — and significantly improve your exam readiness.
            </p>
          </section>

          {/* Pitfalls Section - Card Style */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-6">
              Why Traditional Study Methods Fall Short
            </h2>
            <div className="grid gap-4">
              {pitfalls.map((pitfall, index) => (
                <div 
                  key={pitfall.title} 
                  className="rounded-xl border border-destructive/20 bg-destructive/5 p-4 animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <h3 className="font-medium mb-1 flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-destructive/60"></span>
                    {pitfall.title}
                  </h3>
                  <p className="text-sm text-muted-foreground pl-4">{pitfall.desc}</p>
                </div>
              ))}
            </div>
            <p className="text-muted-foreground leading-relaxed mt-6">
              The solution is to actively engage with your materials by generating questions yourself.
            </p>
          </section>

          {/* Step-by-Step Method - Colorful Cards */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-8">
              Step-by-Step: Converting Slides into Practice Questions
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
                      <ul className="list-disc pl-6 space-y-1 text-muted-foreground text-sm mb-4">
                        {step.details.map((detail) => (
                          <li key={detail}>{detail}</li>
                        ))}
                      </ul>
                    )}

                    {/* Question types grid */}
                    {step.questionTypes && (
                      <div className="grid gap-3 sm:grid-cols-3 mb-4">
                        {step.questionTypes.map((qt) => (
                          <div key={qt.type} className="rounded-lg bg-muted/50 p-3 text-sm">
                            <p className="font-medium mb-1">{qt.type}</p>
                            <p className="text-xs text-muted-foreground">{qt.desc}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Formats list */}
                    {step.formats && (
                      <div className="grid gap-2 sm:grid-cols-2">
                        {step.formats.map((format) => (
                          <div key={format.name} className="flex items-start gap-2 text-sm">
                            <span className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 shrink-0"></span>
                            <div>
                              <span className="font-medium">{format.name}:</span>
                              <span className="text-muted-foreground ml-1">{format.desc}</span>
                            </div>
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
              A Note on Using Tools
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-3">
              The manual method above works well but takes time. If you're looking to speed up 
              the process, there are tools available that can automatically generate practice 
              questions from PDF documents.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              These tools use AI to analyze your lecture content and create questions across 
              different formats and difficulty levels — saving significant time in the 
              question-creation phase.
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
              Turning lecture slides into practice questions is a skill that improves with practice. 
              The first time you do it, it may feel slow. But as you develop a sense for what makes 
              a good question, the process becomes faster — and your exam performance will reflect 
              the effort.
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
