// src/pages/signin.tsx
import React, { useState } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";

export default function SignIn() {
  const { theme } = useTheme();
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleChange = (e: any) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://127.0.0.1:3013/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Ett fel inträffade vid inloggning.");
      } else {
        localStorage.setItem("token", data.token);
        setIsLoggedIn(true);
      }
    } catch (error) {
      setError("Kunde inte ansluta till servern.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`${
        theme === "dark"
          ? "bg-gray-900 text-white"
          : "bg-gray-100 text-gray-900"
      } flex flex-col items-center justify-center p-4`}
    >
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 w-full max-w-md">
        {loading ? (
          <div className="flex justify-center items-center">
            <div className="loader"></div>
            <span className="visually-hidden">Laddar...</span>
          </div>
        ) : isLoggedIn ? (
          <div className="text-center">
            <h1 className="text-2xl font-bold">Du är nu inloggad!</h1>
            <Link
              href="/"
              className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            >
              Gå till startsidan
            </Link>
          </div>
        ) : (
          <>
            <h1 className="text-2xl font-bold mb-4">Logga in</h1>
            {error && <p className="text-red-500">{error}</p>}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <input
                type="text"
                name="username"
                className="p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600"
                value={credentials.username}
                onChange={handleChange}
                placeholder="Användarnamn"
                required
              />
              <input
                type="password"
                name="password"
                className="p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600"
                value={credentials.password}
                onChange={handleChange}
                placeholder="Lösenord"
                required
              />
              <button
                type="submit"
                className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-700 transition-colors dark:bg-blue-600 dark:hover:bg-blue-700"
              >
                Logga in
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
