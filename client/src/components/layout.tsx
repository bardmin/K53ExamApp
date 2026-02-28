import React from "react";
import { Car } from "lucide-react";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <header className="w-full max-w-2xl mb-8 flex items-center justify-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
          <Car className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-xl font-display font-bold leading-tight">DrivePrep</h1>
          <p className="text-sm text-muted-foreground font-medium">License Practice Test</p>
        </div>
      </header>
      
      <main className="w-full max-w-2xl flex-1 flex flex-col">
        {children}
      </main>

      <footer className="w-full max-w-2xl mt-12 text-center text-sm text-muted-foreground pb-4">
        <p>© {new Date().getFullYear()} DrivePrep. All rights reserved.</p>
      </footer>
    </div>
  );
}
