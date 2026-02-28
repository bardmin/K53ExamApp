import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { useQuiz } from "@/lib/quiz-context";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronRight, ShieldAlert, RotateCcw } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function Quiz() {
  const [_, setLocation] = useLocation();
  const { filteredQuestions, currentIndex, answerQuestion, isComplete, user, resetQuiz } = useQuiz();
  const [direction, setDirection] = useState(1); // 1 for forward

  useEffect(() => {
    // Redirect if accessing directly without starting
    if (!user || filteredQuestions.length === 0) {
      setLocation("/");
    }
  }, [user, filteredQuestions, setLocation]);

  useEffect(() => {
    if (isComplete) {
      // Small delay before redirecting to allow last animation to play
      const timer = setTimeout(() => {
        setLocation("/results");
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [isComplete, setLocation]);

  if (!user || filteredQuestions.length === 0 || isComplete) return null;

  const currentQ = filteredQuestions[currentIndex];
  const progress = (currentIndex / filteredQuestions.length) * 100;

  const handleAnswer = (answerNum: string) => {
    setDirection(1);
    answerQuestion(answerNum);
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 50 : -50,
      opacity: 0,
      scale: 0.95
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 50 : -50,
      opacity: 0,
      scale: 0.95
    })
  };

  return (
    <Layout>
      <div className="w-full space-y-6">
        
        {/* Progress Header */}
        <div className="space-y-2">
          <div className="flex justify-between items-end">
            <div className="flex items-center gap-4">
              <span className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
                Question {currentIndex + 1} of {filteredQuestions.length}
              </span>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-7 px-2 text-xs gap-1.5 text-muted-foreground hover:text-destructive">
                    <RotateCcw className="w-3.5 h-3.5" />
                    Restart
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Restart Test?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will reset your current progress and take you back to the start.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={() => {
                        resetQuiz();
                        setLocation("/");
                      }}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Restart
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
            <span className="text-sm font-semibold text-primary">
              {Math.round(progress)}%
            </span>
          </div>
          <Progress value={progress} className="h-2.5 rounded-full bg-secondary" />
        </div>

        {/* Question Container */}
        <div className="relative min-h-[400px]">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 },
                scale: { duration: 0.2 }
              }}
              className="absolute w-full"
            >
              <Card className="glass-card overflow-hidden shadow-xl border-t-4 border-t-primary">
                <CardContent className="p-6 sm:p-8 space-y-8">
                  
                  <h3 className="text-xl sm:text-2xl font-display font-bold text-foreground leading-snug">
                    {currentQ.question_text}
                  </h3>

                  {currentQ.contains_image && currentQ.image_link && (
                    <div className="relative rounded-xl overflow-hidden border bg-muted flex items-center justify-center min-h-[200px]">
                      <img 
                        src={currentQ.image_link} 
                        alt="Question reference" 
                        className="w-full h-auto max-h-[300px] object-contain"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.parentElement?.classList.add('flex-col', 'text-muted-foreground');
                          // Fallback rendering
                          const div = document.createElement('div');
                          div.innerHTML = `<svg class="w-10 h-10 mb-2 mx-auto" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg><p class="text-sm">Image not available</p>`;
                          e.currentTarget.parentElement?.appendChild(div);
                        }}
                      />
                    </div>
                  )}

                  <div className="space-y-3">
                    {currentQ.options.map((opt) => (
                      <button
                        key={opt.answer_number}
                        onClick={() => handleAnswer(opt.answer_number)}
                        className="w-full text-left flex items-center p-4 rounded-xl border-2 border-border bg-card hover:border-primary hover:bg-primary/5 transition-all duration-200 group relative"
                      >
                        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-secondary text-secondary-foreground font-bold mr-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors shrink-0">
                          {opt.answer_number}
                        </span>
                        <span className="font-medium text-foreground pr-8 flex-1">
                          {opt.answer_text}
                        </span>
                        <ChevronRight className="w-5 h-5 text-muted-foreground absolute right-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-primary" />
                      </button>
                    ))}
                  </div>

                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </Layout>
  );
}
