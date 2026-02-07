import { useEffect } from "react";
import { Link } from "react-router-dom";
import { FileText, ArrowRight, HelpCircle, AlertTriangle } from "lucide-react";
import { Footer } from "@/components/Footer";
import { useCanonical } from "@/hooks/useCanonical";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

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
    title: "Reading without testing",
    description: "Many students spend hours re-reading slides, highlighting text, and making notes — then discover they can't recall anything under exam conditions. Recognition (\"I've seen this before\") is not the same as recall (\"I can explain this from memory\"). Without active testing, you're building familiarity, not knowledge."
  },
  {
    title: "Studying everything equally",
    description: "Not all lecture content is equally examinable. Some slides provide background context; others contain core concepts you'll definitely be tested on. Treating everything with the same attention wastes time on low-priority material while under-preparing for what matters most."
  },
  {
    title: "Not converting content into practice",
    description: "Lecture PDFs are passive study materials — they present information but don't challenge you to use it. The gap between reading content and answering exam questions is larger than most students realize. Active transformation of content into self-test questions bridges this gap."
  },
  {
    title: "Leaving revision to the final week",
    description: "Cramming might help you pass, but it leads to shallow understanding and rapid forgetting. Spaced study — reviewing material over multiple sessions across weeks — creates stronger, longer-lasting memory traces. Starting earlier isn't about spending more total hours; it's about distributing those hours effectively."
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
        <article className="prose prose-slate dark:prose-invert max-w-none">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl mb-8">
            How to Study a Whole Semester Using Lecture PDFs
          </h1>

          {/* Introduction */}
          <section className="mb-12">
            <p className="text-lg text-muted-foreground leading-relaxed">
              It's three weeks before finals. You open your course folder and find 40 lecture PDFs, 
              each with 30–60 slides. That's over a thousand slides of content, accumulated across 
              months of classes you half-remember attending.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              The sheer volume feels paralyzing. Where do you even start? How do you know what's 
              important? And how do you transform all of this into something you can actually 
              remember during a two-hour exam?
            </p>
            <p className="text-muted-foreground leading-relaxed">
              This is one of the most common challenges university students face. Lectures are 
              delivered week by week, but exams test everything at once. The course felt manageable 
              in pieces; now you need to consolidate it into coherent, retrievable knowledge.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              The good news: there's a systematic way to approach this. It won't make the work 
              disappear, but it will make your effort more effective — and help you avoid the 
              most common study traps students fall into.
            </p>
          </section>

          {/* Common Mistakes */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <AlertTriangle className="h-6 w-6 text-muted-foreground" />
              Common Mistakes When Studying from PDFs
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Before outlining what works, it's helpful to recognize what doesn't. These patterns 
              are widespread among students — and recognizing them can help you avoid wasted effort.
            </p>
            <div className="space-y-4">
              {mistakes.map((mistake) => (
                <div key={mistake.title} className="pl-4 border-l-2 border-destructive/30">
                  <h3 className="font-medium mb-1">{mistake.title}</h3>
                  <p className="text-sm text-muted-foreground">{mistake.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Structured Approach */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">
              A Structured Approach to Semester-Wide Study
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Here's a practical framework for working through a semester's worth of lecture PDFs 
              in a way that actually prepares you for exams:
            </p>

            {/* Step 1 */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-bold">1</span>
                Organize Your PDFs by Topic
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-3">
                Before studying content, create structure. Most courses are organized into major 
                themes or modules — even if this isn't explicit, you can identify them by looking 
                at lecture titles and content.
              </p>
              <ul className="list-disc pl-6 space-y-1 text-muted-foreground text-sm">
                <li>Group related lectures together (e.g., "Weeks 1–3: Foundations," "Weeks 4–6: Methods")</li>
                <li>Create a simple map of how topics connect to each other</li>
                <li>Identify which topics are foundational vs. which build on earlier material</li>
                <li>Note any topics your professor explicitly said would be on the exam</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-3 text-sm">
                This step takes 30–60 minutes but saves hours of confused, unfocused study later.
              </p>
            </div>

            {/* Step 2 */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-bold">2</span>
                Extract Examinable Concepts
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-3">
                For each topic group, go through the lectures and identify what's actually testable. 
                Not everything on a slide is exam material. Look for:
              </p>
              <div className="grid gap-3 sm:grid-cols-2 text-sm">
                <div className="rounded-lg border border-border p-3">
                  <p className="font-medium text-success mb-1">Likely examinable</p>
                  <ul className="list-disc pl-4 text-muted-foreground space-y-1">
                    <li>Definitions of key terms</li>
                    <li>Core theories or models</li>
                    <li>Processes with distinct steps</li>
                    <li>Comparisons between concepts</li>
                    <li>Content with worked examples</li>
                  </ul>
                </div>
                <div className="rounded-lg border border-border p-3">
                  <p className="font-medium text-muted-foreground mb-1">Less likely examinable</p>
                  <ul className="list-disc pl-4 text-muted-foreground space-y-1">
                    <li>Historical background</li>
                    <li>Tangential anecdotes</li>
                    <li>Administrative slides</li>
                    <li>Overly detailed examples</li>
                    <li>Content marked "for reference"</li>
                  </ul>
                </div>
              </div>
              <p className="text-muted-foreground leading-relaxed mt-3 text-sm">
                Create a condensed list of concepts for each topic. This becomes your study target.
              </p>
            </div>

            {/* Step 3 */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-bold">3</span>
                Turn Content into Self-Test Questions
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-3">
                This is the most important step. For each concept on your list, create questions 
                that test your understanding at different levels:
              </p>
              <div className="space-y-3 text-sm">
                <div className="rounded-lg border border-border p-3">
                  <p className="font-medium mb-1">Recall level</p>
                  <p className="text-muted-foreground">
                    "Define X" or "What are the three types of Y?" — testing basic memory.
                  </p>
                </div>
                <div className="rounded-lg border border-border p-3">
                  <p className="font-medium mb-1">Understanding level</p>
                  <p className="text-muted-foreground">
                    "Why does X happen?" or "How does A relate to B?" — testing comprehension.
                  </p>
                </div>
                <div className="rounded-lg border border-border p-3">
                  <p className="font-medium mb-1">Application level</p>
                  <p className="text-muted-foreground">
                    "Given this scenario, which approach would you use and why?" — testing transfer.
                  </p>
                </div>
              </div>
              <p className="text-muted-foreground leading-relaxed mt-3 text-sm">
                Don't answer questions immediately. The goal is to build a question bank you'll use later.
              </p>
            </div>

            {/* Step 4 */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-bold">4</span>
                Review with Active Recall
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-3">
                Now use your questions. The key principles:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground text-sm">
                <li>
                  <strong>Test before you review.</strong> Try to answer each question from memory 
                  before looking at your notes. Struggling to recall strengthens memory more than 
                  easy retrieval.
                </li>
                <li>
                  <strong>Space your practice.</strong> Don't review the same topic every day. 
                  Alternate between topics, returning to each after a gap of 1–3 days.
                </li>
                <li>
                  <strong>Focus on what you got wrong.</strong> Questions you answered correctly 
                  need less repetition. Prioritize the gaps in your knowledge.
                </li>
                <li>
                  <strong>Explain out loud.</strong> Verbalizing your answers (even to yourself) 
                  reveals gaps that silent reading hides.
                </li>
              </ul>
            </div>

            {/* Step 5 */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-bold">5</span>
                Integrate Across Topics
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                As you get closer to the exam, start practicing questions that connect multiple 
                topics. Real exam questions often require you to synthesize knowledge from different 
                parts of the course. Create (or find) questions that ask you to compare, contrast, 
                or apply concepts across module boundaries.
              </p>
            </div>
          </section>

          {/* Tools Section */}
          <section className="mb-12 rounded-lg border border-border bg-muted/30 p-6">
            <h2 className="text-xl font-semibold mb-3">
              Using Tools to Speed Up the Process
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-3">
              The method above is effective but time-intensive — especially the question-creation 
              step. If you're short on time or have a large volume of material to cover, there are 
              tools that can help automate part of this process.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Some applications can analyze PDF documents and generate practice questions 
              automatically. These won't replace understanding the material, but they can 
              significantly reduce the time spent on question creation, letting you focus more 
              of your energy on actually practicing and learning.
            </p>
          </section>

          {/* FAQ Section */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
              <HelpCircle className="h-6 w-6 text-muted-foreground" />
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
              Studying a whole semester of lecture PDFs is a significant undertaking. There's no 
              shortcut that eliminates the work entirely. But a structured approach — organizing 
              first, extracting what matters, converting to questions, and testing yourself 
              actively — makes that work far more effective than passive review. Start earlier 
              than you think you need to, and trust the process.
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
