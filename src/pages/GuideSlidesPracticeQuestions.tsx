import { useEffect } from "react";
import { Link } from "react-router-dom";
import { FileText, ArrowRight, HelpCircle } from "lucide-react";
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
        {/* Article Header */}
        <article className="prose prose-slate dark:prose-invert max-w-none">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl mb-6">
            How to Turn Lecture Slides into Practice Questions
          </h1>

          {/* Hero Image */}
          <figure className="mb-10">
            <img 
              src={heroImage} 
              alt="Step-by-step process of converting lecture slides into practice exam questions for effective study"
              className="w-full rounded-lg"
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
            <p className="text-muted-foreground leading-relaxed">
              Professors often provide slides summarizing key concepts, but rarely include the kind 
              of questions you'll face on the exam. Past papers, if they exist at all, may be outdated 
              or cover different topics than what you've been taught this semester.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              This leaves students in a frustrating position: you know you need to practice retrieval 
              and application, but you don't have the materials to do so. Re-reading slides feels 
              unproductive, yet creating your own questions seems overwhelming.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              The good news is that your lecture slides already contain everything you need. With a 
              systematic approach, you can transform passive study materials into active practice 
              questions — and significantly improve your exam readiness in the process.
            </p>
          </section>

          {/* Section: Why Traditional Methods Fail */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">
              Why Traditional Study Methods Fall Short
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Before diving into the method, it's worth understanding why common study approaches 
              often don't work as well as we think:
            </p>
            <div className="space-y-4">
              <div className="pl-4 border-l-2 border-border">
                <h3 className="font-medium mb-1">Re-reading slides creates false confidence</h3>
                <p className="text-sm text-muted-foreground">
                  When you read something familiar, it feels like you know it. But recognition is not 
                  the same as recall. On an exam, you need to retrieve information from memory without 
                  prompts — a very different skill than recognizing content you've seen before.
                </p>
              </div>
              <div className="pl-4 border-l-2 border-border">
                <h3 className="font-medium mb-1">Passive highlighting doesn't build understanding</h3>
                <p className="text-sm text-muted-foreground">
                  Highlighting feels productive but requires minimal cognitive effort. You're marking 
                  what seems important without actually processing or connecting the information.
                </p>
              </div>
              <div className="pl-4 border-l-2 border-border">
                <h3 className="font-medium mb-1">It's hard to identify what's actually examinable</h3>
                <p className="text-sm text-muted-foreground">
                  Lecture slides often contain background context, examples, and tangential information 
                  alongside core concepts. Without practice questions, it's difficult to know what 
                  level of detail you'll be expected to demonstrate.
                </p>
              </div>
            </div>
            <p className="text-muted-foreground leading-relaxed mt-4">
              The solution is to actively engage with your materials by generating questions yourself. 
              This forces you to think about what's important, how concepts connect, and how you might 
              be tested.
            </p>
          </section>

          {/* Section: Step-by-Step Method */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">
              Step-by-Step: Converting Slides into Practice Questions
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Here's a practical method you can apply to any lecture PDF or slide deck:
            </p>

            {/* Step 1 */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-bold">1</span>
                Identify the Key Concepts
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-3">
                Go through each slide and extract the core ideas. Look for:
              </p>
              <ul className="list-disc pl-6 space-y-1 text-muted-foreground text-sm">
                <li>Definitions of terms or concepts</li>
                <li>Processes or sequences (steps, stages, phases)</li>
                <li>Comparisons or contrasts between ideas</li>
                <li>Cause-and-effect relationships</li>
                <li>Examples that illustrate broader principles</li>
                <li>Anything the professor emphasized verbally or visually</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-3 text-sm">
                Write these down in a simple list. Don't worry about question format yet — just 
                capture the raw material.
              </p>
            </div>

            {/* Step 2 */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-bold">2</span>
                Convert Concepts into Different Question Types
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-3">
                Take each concept and transform it into questions at different levels:
              </p>
              <div className="space-y-3 text-sm">
                <div className="rounded-lg border border-border p-3">
                  <p className="font-medium mb-1">Recall questions</p>
                  <p className="text-muted-foreground">
                    "What is [term]?" or "List the three stages of [process]."
                    These test basic memory and are often the foundation for harder questions.
                  </p>
                </div>
                <div className="rounded-lg border border-border p-3">
                  <p className="font-medium mb-1">Understanding questions</p>
                  <p className="text-muted-foreground">
                    "Explain why [X] leads to [Y]" or "What is the difference between [A] and [B]?"
                    These require you to demonstrate comprehension, not just memorization.
                  </p>
                </div>
                <div className="rounded-lg border border-border p-3">
                  <p className="font-medium mb-1">Application questions</p>
                  <p className="text-muted-foreground">
                    "Given [scenario], how would you apply [concept]?" or "What would happen if [condition changed]?"
                    These test your ability to use knowledge in new situations.
                  </p>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-bold">3</span>
                Mix Question Formats
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-3">
                Vary how you phrase questions to prepare for different exam formats:
              </p>
              <ul className="list-disc pl-6 space-y-1 text-muted-foreground text-sm">
                <li><strong>Multiple choice:</strong> Create a correct answer and 2–3 plausible distractors</li>
                <li><strong>Short answer:</strong> Questions requiring 1–3 sentence responses</li>
                <li><strong>Essay prompts:</strong> Broader questions requiring structured arguments</li>
                <li><strong>True/False:</strong> Statements to evaluate (include some false ones)</li>
              </ul>
            </div>

            {/* Step 4 */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-bold">4</span>
                Test Yourself with Spacing
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Don't answer questions immediately after creating them. Wait at least a day, then 
                attempt them without looking at your slides. This spaced retrieval practice is 
                one of the most effective learning techniques supported by cognitive science research.
              </p>
            </div>

            {/* Step 5 */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-bold">5</span>
                Review and Refine
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                After testing yourself, note which questions you struggled with. These indicate 
                areas needing more review. You can also refine your questions — if one was too 
                easy or poorly worded, improve it for next time.
              </p>
            </div>
          </section>

          {/* Section: Tools as Option */}
          <section className="mb-12 rounded-lg border border-border bg-muted/30 p-6">
            <h2 className="text-xl font-semibold mb-3">
              A Note on Using Tools
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-3">
              The manual method above works well but takes time — especially when you have many 
              lectures to cover before an exam. If you're looking to speed up the process, there 
              are tools available that can automatically generate practice questions from PDF documents.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              These tools use AI to analyze your lecture content and create questions across 
              different formats and difficulty levels. They're not a replacement for understanding 
              the material, but they can save significant time in the question-creation phase, 
              letting you focus on actually practicing and learning.
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
              Turning lecture slides into practice questions is a skill that improves with practice. 
              The first time you do it, it may feel slow and awkward. But as you develop a sense 
              for what makes a good question, the process becomes faster and more intuitive — and 
              your exam performance will reflect the effort.
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
