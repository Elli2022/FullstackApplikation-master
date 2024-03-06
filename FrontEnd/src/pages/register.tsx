import React, { useState } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";

export default function Register() {
  const { theme } = useTheme();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isRegistered, setIsRegistered] = useState(false);

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e: any) => {
    e.preventDefault();
    setError("");

    const API_URL = "http://127.0.0.1:3013/api/v1/user";

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.data || "Ett fel uppstod vid registrering.");
      } else {
        setIsRegistered(true);
      }
    } catch (error) {
      setError("Ett oväntat fel inträffade.");
    }
  };

  return (
    <div
      className={` ${
        theme === "dark"
          ? "bg-gray-900 text-white"
          : "bg-gray-100 text-gray-900"
      } flex flex-col items-center justify-center p-4`}
    >
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 w-full max-w-md">
        {!isRegistered && (
          <>
            <h2 className="text-2xl font-bold mb-4">
              Välkommen till vår tjänst!
            </h2>
            <p className="mb-6">Registrera dig nedan för att komma igång.</p>
          </>
        )}
        {error && <p className="text-red-500">{error}</p>}
        {isRegistered ? (
          <div className="text-center">
            <h1 className="text-2xl font-bold">
              Välkommen, {formData.username}!
            </h1>
            <p className="my-4">Ditt konto har skapats. Vill du logga in nu?</p>
            <Link
              href="/signin"
              className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            >
              Logga in
            </Link>
          </div>
        ) : (
          <form onSubmit={handleRegister} className="flex flex-col gap-4">
            <input
              type="text"
              name="username"
              className="p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600"
              value={formData.username}
              onChange={handleChange}
              placeholder="Användarnamn"
              required
            />
            <input
              type="email"
              name="email"
              className="p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600"
              value={formData.email}
              onChange={handleChange}
              placeholder="E-post"
              required
            />
            <input
              type="password"
              name="password"
              className="p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600"
              value={formData.password}
              onChange={handleChange}
              placeholder="Lösenord"
              required
            />
            <button
              type="submit"
              className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-700 transition-colors dark:bg-blue-600 dark:hover:bg-blue-700"
            >
              Registrera
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
