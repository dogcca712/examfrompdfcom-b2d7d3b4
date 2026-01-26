import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function PrivacyPolicy() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      
      <main className="flex-1 py-16">
        <div className="mx-auto max-w-3xl px-4">
          <h1 className="mb-8 text-4xl font-bold tracking-tight">Privacy Policy</h1>
          <p className="mb-8 text-muted-foreground">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>

          <div className="space-y-8 text-foreground">
            {/* Introduction */}
            <section>
              <h2 className="mb-4 text-2xl font-semibold">Introduction</h2>
              <p className="text-muted-foreground leading-relaxed">
                ExamFromPDF is an online tool that helps students and educators generate practice exams from PDF documents. 
                We value your privacy and are committed to being transparent about how we handle your data. 
                This policy explains what information we collect and how we use it.
              </p>
            </section>

            {/* Information We Collect */}
            <section>
              <h2 className="mb-4 text-2xl font-semibold">Information We Collect</h2>
              <p className="mb-4 text-muted-foreground leading-relaxed">
                ExamFromPDF is designed to work without requiring an account. We collect minimal information:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>PDF files you upload for exam generation</li>
                <li>Basic usage data such as browser type and device information</li>
                <li>Cookies necessary for the website to function properly</li>
              </ul>
            </section>

            {/* How Uploaded PDFs Are Used */}
            <section>
              <h2 className="mb-4 text-2xl font-semibold">How Uploaded PDFs Are Used</h2>
              <p className="mb-4 text-muted-foreground leading-relaxed">
                When you upload a PDF, our system processes it to extract content and generate practice exam questions. 
                Your uploaded files are:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Used solely for generating your practice exams</li>
                <li>Not used to train AI models or for any other purpose</li>
                <li>Not shared with third parties</li>
                <li>Not reviewed or accessed by our team unless required for technical support</li>
              </ul>
            </section>

            {/* File Storage and Retention */}
            <section>
              <h2 className="mb-4 text-2xl font-semibold">File Storage and Retention</h2>
              <p className="mb-4 text-muted-foreground leading-relaxed">
                Uploaded PDF files and generated exams are stored temporarily to allow you to access your results:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Files are retained for up to 7 days after upload</li>
                <li>After 7 days, files are automatically deleted from our servers</li>
                <li>You cannot retrieve files once they have been deleted</li>
              </ul>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                We recommend downloading your generated exams promptly if you wish to keep them.
              </p>
            </section>

            {/* Data Security */}
            <section>
              <h2 className="mb-4 text-2xl font-semibold">Data Security</h2>
              <p className="text-muted-foreground leading-relaxed">
                We take reasonable measures to protect your uploaded files and data. 
                All file transfers are encrypted using HTTPS. 
                However, no method of transmission over the internet is completely secure, 
                and we cannot guarantee absolute security.
              </p>
            </section>

            {/* Third-Party Services */}
            <section>
              <h2 className="mb-4 text-2xl font-semibold">Third-Party Services</h2>
              <p className="text-muted-foreground leading-relaxed">
                ExamFromPDF may use third-party services for hosting, analytics, and AI processing. 
                These services have their own privacy policies and may collect basic usage information. 
                We do not sell your data to any third parties.
              </p>
            </section>

            {/* Changes to This Policy */}
            <section>
              <h2 className="mb-4 text-2xl font-semibold">Changes to This Policy</h2>
              <p className="text-muted-foreground leading-relaxed">
                We may update this Privacy Policy from time to time. 
                Any changes will be posted on this page with an updated revision date. 
                We encourage you to review this policy periodically.
              </p>
            </section>

            {/* Contact Information */}
            <section>
              <h2 className="mb-4 text-2xl font-semibold">Contact Information</h2>
              <p className="text-muted-foreground leading-relaxed">
                If you have any questions about this Privacy Policy or how we handle your data, 
                please contact us through the website.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
