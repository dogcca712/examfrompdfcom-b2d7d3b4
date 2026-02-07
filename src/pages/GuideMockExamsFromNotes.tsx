import { useEffect } from "react";
import { Link } from "react-router-dom";
import { FileText, ArrowRight, HelpCircle, CheckCircle, Clock, Target } from "lucide-react";
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
    title: "Coverage of key topics",
    description: "A good mock exam tests the major themes and concepts from your course. It shouldn't just focus on what you find interesting or easy — it should proportionally represent what's likely to appear on the real exam."
  },
  {
    icon: CheckCircle,
    title: "Mix of question difficulty",
    description: "Include questions ranging from basic recall to complex application. This mirrors real exams and helps you gauge your understanding at different levels. Easy questions build confidence; hard questions reveal gaps."
  },
  {
    icon: Clock,
    title: "Realistic time constraints",
    description: "Time pressure changes everything. A question you can answer in five minutes of relaxed thinking becomes much harder with a clock running. Your mock exam should have a time limit that creates similar pressure to the real thing."
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
        <article className="prose prose-slate dark:prose-invert max-w-none">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl mb-6">
            How to Create Mock Exams from Your Own Notes
          </h1>

          {/* Hero Image */}
          <figure className="mb-10">
            <img 
              src={heroImage} 
              alt="Illustration showing the transformation of personal study notes into structured mock exam papers with timer"
              className="w-full rounded-lg"
              loading="eager"
            />
          </figure>

          {/* Introduction */}
          <section className="mb-12">
            <p className="text-lg text-muted-foreground leading-relaxed">
              Mock exams are one of the most effective ways to prepare for a real exam. They force 
              you to retrieve information under pressure, reveal gaps in your knowledge, and build 
              familiarity with exam conditions. There's strong evidence from learning science that 
              practice testing outperforms passive study methods like re-reading or highlighting.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              The problem is access. Many courses don't release past papers, or the available ones 
              are outdated and cover different material than what you've been taught. You know you 
              should practice with mock exams, but you don't have any.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              The solution is to create your own. This isn't as hard as it sounds — and the process 
              of creating a mock exam is itself a powerful study technique. By forcing yourself to 
              think about what questions might appear and how to phrase them, you engage with the 
              material more deeply than you would by simply reading it.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              This guide walks through a practical method for turning your own notes into effective 
              mock exams.
            </p>
          </section>

          {/* What Makes a Good Mock Exam */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">
              What Makes a Good Mock Exam
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Before creating questions, it helps to understand what you're aiming for. A useful 
              mock exam has three key qualities:
            </p>
            <div className="space-y-4">
              {mockExamQualities.map((quality) => (
                <div key={quality.title} className="flex gap-4">
                  <div className="shrink-0">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                      <quality.icon className="h-5 w-5" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">{quality.title}</h3>
                    <p className="text-sm text-muted-foreground">{quality.description}</p>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-muted-foreground leading-relaxed mt-6">
              Your mock exam doesn't need to be perfect. It needs to be useful — challenging enough 
              to expose weaknesses and comprehensive enough to cover what matters.
            </p>
          </section>

          {/* Step-by-Step Process */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">
              Step-by-Step: Creating Mock Exams from Your Notes
            </h2>

            {/* Step 1 */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-bold">1</span>
                Review Your Notes and Identify Key Concepts
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-3">
                Start by going through all your notes — lecture slides, handwritten notes, textbook 
                summaries. As you review, identify the core concepts that are likely to be tested.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-3">
                Look for:
              </p>
              <ul className="list-disc pl-6 space-y-1 text-muted-foreground text-sm">
                <li>Definitions and key terminology</li>
                <li>Theories, models, or frameworks your professor emphasized</li>
                <li>Processes with distinct steps or phases</li>
                <li>Relationships between concepts (cause-effect, compare-contrast)</li>
                <li>Examples that illustrate broader principles</li>
                <li>Anything marked as "important" or repeated across multiple lectures</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-3 text-sm">
                Create a list of these concepts. This becomes the foundation of your mock exam.
              </p>
            </div>

            {/* Step 2 */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-bold">2</span>
                Turn Concepts into Questions
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-3">
                For each concept, generate questions at different cognitive levels:
              </p>
              <div className="space-y-3 text-sm">
                <div className="rounded-lg border border-border p-3">
                  <p className="font-medium mb-1">Knowledge/Recall</p>
                  <p className="text-muted-foreground mb-2">
                    "Define [term]" or "List the components of [concept]"
                  </p>
                  <p className="text-xs text-muted-foreground/70 italic">
                    Example: "Define cognitive load and list its three types."
                  </p>
                </div>
                <div className="rounded-lg border border-border p-3">
                  <p className="font-medium mb-1">Comprehension/Understanding</p>
                  <p className="text-muted-foreground mb-2">
                    "Explain why [X]" or "What is the relationship between [A] and [B]?"
                  </p>
                  <p className="text-xs text-muted-foreground/70 italic">
                    Example: "Explain why intrinsic cognitive load cannot be reduced by instructional design."
                  </p>
                </div>
                <div className="rounded-lg border border-border p-3">
                  <p className="font-medium mb-1">Application/Analysis</p>
                  <p className="text-muted-foreground mb-2">
                    "Given [scenario], how would you apply [concept]?" or "Analyze [situation] using [framework]"
                  </p>
                  <p className="text-xs text-muted-foreground/70 italic">
                    Example: "A student is struggling to learn from a complex diagram. Using cognitive load theory, suggest two modifications to improve learning."
                  </p>
                </div>
              </div>
              <p className="text-muted-foreground leading-relaxed mt-4 text-sm">
                Aim for a mix: roughly 30% recall, 40% understanding, and 30% application. Adjust 
                based on your course — some subjects emphasize memorization, others emphasize problem-solving.
              </p>
            </div>

            {/* Step 3 */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-bold">3</span>
                Organize Questions into Exam Format
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-3">
                Structure your questions to resemble a real exam:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground text-sm">
                <li>
                  <strong>Group by section.</strong> If your real exam has sections (e.g., multiple 
                  choice, short answer, essay), organize your mock exam the same way.
                </li>
                <li>
                  <strong>Assign point values.</strong> This helps you prioritize during timed practice 
                  and makes the experience feel more realistic.
                </li>
                <li>
                  <strong>Order by difficulty.</strong> Typically, exams start with easier questions. 
                  Place your recall questions early and application questions later.
                </li>
                <li>
                  <strong>Match the length.</strong> If your real exam is 2 hours with 50 questions, 
                  your mock should be similar. Don't create a 100-question mock for a 30-question exam.
                </li>
              </ul>
            </div>

            {/* Step 4 */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-bold">4</span>
                Simulate Exam Conditions
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-3">
                Creating the mock exam is only half the value. Taking it under realistic conditions 
                is the other half.
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground text-sm">
                <li>
                  <strong>Set a timer.</strong> Stick to it. Don't give yourself extra time "just 
                  this once" — the goal is to practice under pressure.
                </li>
                <li>
                  <strong>No notes or resources.</strong> Close your books, turn off your phone, 
                  and work from memory only.
                </li>
                <li>
                  <strong>Find a quiet space.</strong> Simulate the focus required in an exam hall 
                  as closely as possible.
                </li>
                <li>
                  <strong>Write full answers.</strong> Don't just think through answers — write them 
                  out. This tests whether you can actually articulate your knowledge, not just 
                  recognize it.
                </li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-3 text-sm">
                After finishing, review your answers critically. Mark what you got wrong and note 
                topics that need more study.
              </p>
            </div>
          </section>

          {/* Tools Section */}
          <section className="mb-12 rounded-lg border border-border bg-muted/30 p-6">
            <h2 className="text-xl font-semibold mb-3">
              Tools That Can Help
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-3">
              Creating mock exams manually is effective but time-consuming. If you're working with 
              PDF notes or lecture slides, some tools can automate the question-generation step.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              These tools analyze your documents and produce practice questions in various formats. 
              They won't replace understanding the material — you still need to study — but they can 
              save hours of question-writing time, especially when you have a lot of material to cover.
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
              Creating mock exams from your own notes takes effort, but it's effort that pays off 
              twice: once during creation (which deepens your understanding) and again during practice 
              (which strengthens your recall). If you don't have access to past papers, this is one 
              of the best alternatives available — and in some ways, it's even better, because you 
              control exactly what gets tested.
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
