import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/hooks/useTheme";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import UseCaseLecturePDFs from "./pages/UseCaseLecturePDFs";
import UseCaseTextbookPDFs from "./pages/UseCaseTextbookPDFs";
import GuideSlidesPracticeQuestions from "./pages/GuideSlidesPracticeQuestions";
import GuideStudySemesterPDFs from "./pages/GuideStudySemesterPDFs";
import GuideMockExamsFromNotes from "./pages/GuideMockExamsFromNotes";

const queryClient = new QueryClient();

// Protected route wrapper
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

const App = () => (
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/terms" element={<TermsOfService />} />
              <Route path="/use-case/lecture-pdfs" element={<UseCaseLecturePDFs />} />
              <Route path="/use-case/textbook-pdfs" element={<UseCaseTextbookPDFs />} />
              <Route path="/how-to-turn-lecture-slides-into-practice-questions" element={<GuideSlidesPracticeQuestions />} />
              <Route path="/how-to-study-a-whole-semester-from-lecture-pdfs" element={<GuideStudySemesterPDFs />} />
              <Route path="/how-to-create-mock-exams-from-your-own-notes" element={<GuideMockExamsFromNotes />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </BrowserRouter>
);

export default App;
