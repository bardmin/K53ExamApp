import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Question } from "@shared/schema";

export interface UserDetails {
  name: string;
  surname: string;
  licenseCode: string;
  category: number;
}

interface QuizState {
  user: UserDetails | null;
  filteredQuestions: Question[];
  answers: Record<number, string>; // question_number -> answer_number
  currentIndex: number;
  isComplete: boolean;
}

interface QuizContextType extends QuizState {
  startQuiz: (user: UserDetails, allQuestions: Question[]) => void;
  answerQuestion: (answerNumber: string) => void;
  resetQuiz: () => void;
  getScore: () => { correct: number; total: number; percentage: number };
}

const QuizContext = createContext<QuizContextType | undefined>(undefined);

const STORAGE_KEY = "driving-license-quiz-state";

export function QuizProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<QuizState>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse quiz state from localStorage", e);
      }
    }
    return {
      user: null,
      filteredQuestions: [],
      answers: {},
      currentIndex: 0,
      isComplete: false,
    };
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const startQuiz = (user: UserDetails, allQuestions: Question[]) => {
    // Apply filtering logic
    const filtered = allQuestions.filter((q) => {
      const categoryMatch = q.category === user.category;
      // license code "00" is applicable to all tests for the selected category
      const licenseMatch = q.license_code === "00" || q.license_code === user.licenseCode;
      return categoryMatch && licenseMatch;
    });

    setState({
      user,
      filteredQuestions: filtered,
      answers: {},
      currentIndex: 0,
      isComplete: false,
    });
  };

  const answerQuestion = (answerNumber: string) => {
    setState((prev) => {
      const currentQuestion = prev.filteredQuestions[prev.currentIndex];
      const newAnswers = { ...prev.answers, [currentQuestion.question_number]: answerNumber };
      
      const nextIndex = prev.currentIndex + 1;
      const isComplete = nextIndex >= prev.filteredQuestions.length;

      return {
        ...prev,
        answers: newAnswers,
        currentIndex: isComplete ? prev.currentIndex : nextIndex,
        isComplete: isComplete || prev.isComplete,
      };
    });
  };

  const resetQuiz = () => {
    setState({
      user: null,
      filteredQuestions: [],
      answers: {},
      currentIndex: 0,
      isComplete: false,
    });
    localStorage.removeItem(STORAGE_KEY);
  };

  const getScore = () => {
    if (!state.filteredQuestions.length) return { correct: 0, total: 0, percentage: 0 };
    
    let correct = 0;
    const total = state.filteredQuestions.length;

    state.filteredQuestions.forEach((q) => {
      const userAnswer = state.answers[q.question_number];
      const correctOption = q.options.find((opt) => opt.correct_answer);
      if (correctOption && userAnswer === correctOption.answer_number) {
        correct++;
      }
    });

    return {
      correct,
      total,
      percentage: Math.round((correct / total) * 100),
    };
  };

  return (
    <QuizContext.Provider value={{ ...state, startQuiz, answerQuestion, resetQuiz, getScore }}>
      {children}
    </QuizContext.Provider>
  );
}

export function useQuiz() {
  const context = useContext(QuizContext);
  if (context === undefined) {
    throw new Error("useQuiz must be used within a QuizProvider");
  }
  return context;
}
