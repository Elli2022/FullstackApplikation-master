import React, { useState } from "react";
import Link from "next/link";

export default function Register() {
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
    <div className="bg-black text-white p-8">
      {!isRegistered && (
        <div className="mb-6">
          <h2 className="text-lg mb-2">Välkommen till vår tjänst!</h2>
          <p>Registrera dig nedan för att komma igång.</p>
        </div>
      )}
      {isRegistered ? (
        <div>
          <h1>Välkommen, {formData.username}!</h1>
          <p>Vill du logga in?</p>
          <Link href="/signin" className="text-blue-500 hover:text-blue-700">
            Logga in
          </Link>
        </div>
      ) : (
        <>
          {error && <p className="text-red-500">{error}</p>}
          <form onSubmit={handleRegister} className="flex flex-col gap-4">
            <input
              type="text"
              name="username"
              className="p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
              value={formData.username}
              onChange={handleChange}
              placeholder="Användarnamn"
              required
            />
            <input
              type="email"
              name="email"
              className="p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
              value={formData.email}
              onChange={handleChange}
              placeholder="E-post"
              required
            />
            <input
              type="password"
              name="password"
              className="p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
              value={formData.password}
              onChange={handleChange}
              placeholder="Lösenord"
              required
            />
            <button
              type="submit"
              className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Registrera
            </button>
          </form>
        </>
      )}
    </div>
  );
}
