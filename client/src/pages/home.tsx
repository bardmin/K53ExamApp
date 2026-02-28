import { useState } from "react";
import { useLocation } from "wouter";
import { useQuestions } from "@/hooks/use-questions";
import { useQuiz } from "@/lib/quiz-context";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, FileCheck2, Timer } from "lucide-react";

const LICENSE_CODES = ["00", "01", "02", "03", "04", "08", "10", "11", "14"];
const CATEGORIES = [
  { value: "1", label: "Category 1 (Light Vehicles)" },
  { value: "2", label: "Category 2 (Heavy Vehicles)" },
  { value: "3", label: "Category 3 (Motorcycles)" },
];

export default function Home() {
  const [_, setLocation] = useLocation();
  const { data: questions, isLoading, isError } = useQuestions();
  const { startQuiz } = useQuiz();

  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    licenseCode: "",
    category: "",
  });

  const isFormValid = formData.name && formData.surname && formData.licenseCode && formData.category;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid || !questions) return;

    startQuiz(
      {
        name: formData.name,
        surname: formData.surname,
        licenseCode: formData.licenseCode,
        category: parseInt(formData.category, 10),
      },
      questions
    );

    setLocation("/quiz");
  };

  return (
    <Layout>
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            2024 Updated Syllabus
          </div>
          <h2 className="text-4xl md:text-5xl font-display font-extrabold text-foreground tracking-tight">
            Pass your driving test <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">with confidence</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-lg mx-auto">
            Take our professional practice test tailored to your specific license code and vehicle category.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {[
            { icon: BookOpen, title: "Official Questions", desc: "Based on latest manual" },
            { icon: Timer, title: "Self-Paced", desc: "Take your time to learn" },
            { icon: FileCheck2, title: "Detailed Review", desc: "Learn from your mistakes" }
          ].map((feature, i) => (
            <div key={i} className="flex flex-col items-center text-center p-4 rounded-2xl bg-card border border-border shadow-sm">
              <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-3">
                <feature.icon className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-sm">{feature.title}</h3>
              <p className="text-xs text-muted-foreground mt-1">{feature.desc}</p>
            </div>
          ))}
        </div>

        <Card className="glass-card border-none shadow-2xl">
          <CardHeader>
            <CardTitle className="text-2xl">Candidate Details</CardTitle>
            <CardDescription>
              Please enter your details to generate your customized test.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-12 space-y-4">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                <p className="text-muted-foreground font-medium">Loading question bank...</p>
              </div>
            ) : isError ? (
              <div className="p-4 rounded-xl bg-destructive/10 text-destructive text-center">
                Failed to load questions. Please check your connection and try again.
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">First Name</Label>
                    <Input
                      id="name"
                      placeholder="John"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="h-12 bg-background/50 focus:bg-background transition-colors"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="surname">Surname</Label>
                    <Input
                      id="surname"
                      placeholder="Doe"
                      value={formData.surname}
                      onChange={(e) => setFormData(prev => ({ ...prev, surname: e.target.value }))}
                      className="h-12 bg-background/50 focus:bg-background transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="licenseCode">License Code</Label>
                    <Select
                      value={formData.licenseCode}
                      onValueChange={(val) => setFormData(prev => ({ ...prev, licenseCode: val }))}
                    >
                      <SelectTrigger className="h-12 bg-background/50">
                        <SelectValue placeholder="Select code..." />
                      </SelectTrigger>
                      <SelectContent>
                        {LICENSE_CODES.map(code => (
                          <SelectItem key={code} value={code}>
                            Code {code}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Vehicle Category</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(val) => setFormData(prev => ({ ...prev, category: val }))}
                    >
                      <SelectTrigger className="h-12 bg-background/50">
                        <SelectValue placeholder="Select category..." />
                      </SelectTrigger>
                      <SelectContent>
                        {CATEGORIES.map(cat => (
                          <SelectItem key={cat.value} value={cat.value}>
                            {cat.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  disabled={!isFormValid}
                  className="w-full h-14 text-lg font-bold shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all hover:-translate-y-0.5 rounded-xl"
                >
                  Start Practice Test
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
