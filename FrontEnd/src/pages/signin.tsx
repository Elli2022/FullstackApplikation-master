// src/pages/signin.tsx
import React, { useState } from "react";

export default function SignIn() {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Ny state för att spåra inloggning

  const handleChange = (e: any) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
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
        // Sparar token i localStorage och uppdatera inloggningsstatus
        localStorage.setItem("token", data.token);
        setIsLoggedIn(true);
        console.log("Inloggad, token:", data.token);
      }
    } catch (error) {
      setError("Kunde inte ansluta till servern.");
    }
  };

  return (
    <div>
      <h1>Logga in</h1>
      {error && <p className="error">{error}</p>}
      {isLoggedIn && <p>Du är nu inloggad!</p>}{" "}
      {/* Nytt meddelande om inloggad */}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          value={credentials.username}
          onChange={handleChange}
          placeholder="Användarnamn"
          required
        />
        <input
          type="password"
          name="password"
          value={credentials.password}
          onChange={handleChange}
          placeholder="Lösenord"
          required
        />
        <button type="submit">Logga in</button>
      </form>
    </div>
  );
}
