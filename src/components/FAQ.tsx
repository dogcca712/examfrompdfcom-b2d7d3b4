import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "What types of PDFs can I upload?",
    answer: "You can upload lecture notes, textbooks, study guides, or any educational material in PDF format. Our AI works best with text-based PDFs, but can also process scanned documents with OCR. Files up to 100MB are supported.",
  },
  {
    question: "What question types are available?",
    answer: "ExamGen supports multiple choice questions (MCQs), short answer questions, and essay/long-form questions. You can choose your preferred mix and difficulty level before generating.",
  },
  {
    question: "How is the exam formatted?",
    answer: "Your practice exam is professionally typeset using LaTeX, the same system used by academic journals and textbooks. This ensures clean formatting, proper mathematical notation, and print-ready quality.",
  },
  {
    question: "Do I need to create an account?",
    answer: "No account is required to generate your first exam. You can try the service immediately. Creating a free account lets you access your exam history and manage downloads.",
  },
  {
    question: "How does pricing work?",
    answer: "ExamGen uses a simple pay-per-download model. You can generate and preview exams for free. When you're satisfied with the result, pay $0.99 to unlock the full PDF download with answer key.",
  },
  {
    question: "Is my data secure?",
    answer: "Yes, your documents are processed securely and are never stored permanently. We use encryption for all file transfers, and your uploaded PDFs are automatically deleted after processing.",
  },
  {
    question: "Can I get a refund?",
    answer: "If you're not satisfied with your generated exam, contact our support team within 24 hours of purchase. We'll review your case and provide a refund if the output quality doesn't meet our standards.",
  },
];

export function FAQ() {
  return (
    <section id="faq" className="py-24 bg-background">
      <div className="mx-auto max-w-3xl px-4">
        {/* Section Header */}
        <div className="mb-12 text-center">
          <span className="mb-4 inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
            FAQ
          </span>
          <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-muted-foreground">
            Everything you need to know about ExamGen
          </p>
        </div>

        {/* FAQ Accordion */}
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
