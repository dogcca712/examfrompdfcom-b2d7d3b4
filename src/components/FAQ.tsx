import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqs = [
  {
    question: "How does the PDF exam generator work?",
    answer:
      "Upload your lecture PDF or study materials, and our AI analyzes the content to generate practice exams automatically. The process takes just seconds and requires no technical setup.",
  },
  {
    question: "Can I generate exams from any PDF?",
    answer:
      "Yes, you can generate exams from PDF files including lecture slides, textbooks, and study guides. The AI quiz generator works best with text-based educational content.",
  },
  {
    question: "What types of questions can the AI generate?",
    answer:
      "The tool creates multiple choice questions, short answer prompts, and essay-style questions. You can choose your preferred question format and difficulty level before generating practice exams.",
  },
  {
    question: "Is signup required to use this tool?",
    answer:
      "No account is required to generate practice exams. You can start using the online exam tool immediately without signing up.",
  },
  {
    question: "Is my PDF content secure?",
    answer:
      "Your PDF files are processed securely and stored temporarily for up to 7 days to support exam generation and access. All files are deleted automatically after this period.",
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
          <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">Frequently Asked Questions</h2>
          <p className="text-lg text-muted-foreground">Everything you need to know about ExamFromPDF</p>
        </div>

        {/* FAQ Accordion */}
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
