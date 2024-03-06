// src/pages/index.tsx
import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";

const Home = () => {
  const { theme, setTheme } = useTheme();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  function handleThemeChange() {
    setTheme(theme === "dark" ? "light" : "dark");
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-xl font-bold">
        Welcome to first My Next.js and Node.js Fullstack Project
      </h1>
    </div>
  );
};

export default Home;
