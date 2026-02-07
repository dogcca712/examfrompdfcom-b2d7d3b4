import { Link } from "react-router-dom";
import { BookOpen } from "lucide-react";

const guides = [
  {
    title: "How to Turn Lecture Slides into Practice Questions",
    url: "/how-to-turn-lecture-slides-into-practice-questions"
  },
  {
    title: "How to Study a Whole Semester Using Lecture PDFs",
    url: "/how-to-study-a-whole-semester-from-lecture-pdfs"
  },
  {
    title: "How to Create Mock Exams from Your Own Notes",
    url: "/how-to-create-mock-exams-from-your-own-notes"
  }
];

export const StudyGuides = () => {
  return (
    <section className="py-16 px-4 bg-muted/30">
      <div className="mx-auto max-w-3xl">
        <div className="flex items-center gap-2 mb-4">
          <BookOpen className="h-5 w-5 text-muted-foreground" />
          <h2 className="text-xl font-semibold">Study Guides for Exam Preparation</h2>
        </div>
        
        <p className="text-muted-foreground mb-6 leading-relaxed">
          These guides help university students learn how to study, revise, and create practice 
          questions using their own lecture materials. Each guide offers a practical, step-by-step 
          approach you can apply to any course.
        </p>

        <nav className="space-y-3">
          {guides.map((guide) => (
            <div key={guide.url}>
              <Link 
                to={guide.url}
                className="text-foreground hover:text-primary underline underline-offset-4 transition-colors"
              >
                {guide.title}
              </Link>
            </div>
          ))}
        </nav>
      </div>
    </section>
  );
};
