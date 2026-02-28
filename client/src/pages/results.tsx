import { useEffect } from "react";
import { useLocation, Link } from "wouter";
import { motion } from "framer-motion";
import { useQuiz } from "@/lib/quiz-context";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Share2, RefreshCw, ListChecks, Award, Trophy, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Results() {
  const [_, setLocation] = useLocation();
  const { user, getScore, resetQuiz, isComplete } = useQuiz();
  const { toast } = useToast();

  useEffect(() => {
    if (!user || !isComplete) {
      setLocation("/");
    }
  }, [user, isComplete, setLocation]);

  if (!user || !isComplete) return null;

  const score = getScore();
  const isPassing = score.percentage >= 75; // Assume 75% is passing for visual purposes

  const handleShare = async () => {
    const text = `I just scored ${score.percentage}% (${score.correct}/${score.total}) on my License Code ${user.licenseCode} practice test!`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: "My DrivePrep Result",
          text: text,
          url: window.location.origin,
        });
      } catch (err) {
        console.log("Error sharing:", err);
      }
    } else {
      navigator.clipboard.writeText(text);
      toast({
        title: "Copied to clipboard!",
        description: "Share your results with your friends.",
      });
    }
  };

  const handleRetake = () => {
    resetQuiz();
    setLocation("/");
  };

  return (
    <Layout>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full space-y-6"
      >
        <Card className="glass-card overflow-hidden relative border-none shadow-2xl">
          <div className={`absolute top-0 left-0 w-full h-32 ${isPassing ? 'bg-gradient-to-br from-success to-emerald-400' : 'bg-gradient-to-br from-destructive to-red-400'}`} />
          
          <CardContent className="pt-24 pb-12 px-6 sm:px-12 flex flex-col items-center text-center relative z-10">
            <div className={`w-24 h-24 rounded-full flex items-center justify-center bg-card shadow-xl mb-6 border-4 ${isPassing ? 'border-success text-success' : 'border-destructive text-destructive'}`}>
              {isPassing ? <Trophy className="w-12 h-12" /> : <AlertTriangle className="w-12 h-12" />}
            </div>

            <h2 className="text-3xl sm:text-4xl font-display font-black text-foreground mb-2">
              {isPassing ? "Congratulations!" : "Keep Practicing!"}
            </h2>
            <p className="text-xl text-muted-foreground font-medium mb-8">
              {user.name} {user.surname}
            </p>

            <div className="w-full max-w-sm bg-muted/50 rounded-3xl p-6 mb-8 border border-border shadow-inner">
              <div className="flex justify-between items-center mb-4">
                <span className="text-muted-foreground font-semibold">Final Score</span>
                <span className={`text-4xl font-black ${isPassing ? 'text-success' : 'text-destructive'}`}>
                  {score.percentage}%
                </span>
              </div>
              <div className="h-4 bg-background rounded-full overflow-hidden mb-2">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${score.percentage}%` }}
                  transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
                  className={`h-full ${isPassing ? 'bg-success' : 'bg-destructive'}`}
                />
              </div>
              <p className="text-sm font-medium text-muted-foreground">
                {score.correct} correct out of {score.total} questions
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-md">
              <Link href="/review" className="w-full">
                <Button className="w-full h-14 rounded-xl text-base font-semibold shadow-md" variant="secondary">
                  <ListChecks className="w-5 h-5 mr-2" />
                  Review Answers
                </Button>
              </Link>
              
              <Button onClick={handleShare} className="w-full h-14 rounded-xl text-base font-semibold shadow-md" variant="default">
                <Share2 className="w-5 h-5 mr-2" />
                Share Result
              </Button>
              
              <Button onClick={handleRetake} className="w-full h-14 rounded-xl text-base font-semibold shadow-md sm:col-span-2 mt-2" variant="outline">
                <RefreshCw className="w-5 h-5 mr-2" />
                Retake Test
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </Layout>
  );
}
