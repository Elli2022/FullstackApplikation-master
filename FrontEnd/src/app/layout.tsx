// src/app/layout.tsx
import React from "react";
import { ThemeProvider } from "@/components/theme-provider";
import Navbar from "@/components/Navbar"; // Importera Navbar
import ModeToggle from "@/components/ModeToggle";

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground">
        <Navbar /> {/* Använd Navbar här */}
        <ModeToggle />
        <div className="wrapper">{children}</div>
      </div>
    </ThemeProvider>
  );
}
