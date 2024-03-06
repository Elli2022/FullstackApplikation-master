// src/pages/dashboard.tsx
import React, { useState, useEffect } from "react";
import LogoutButton from "../components/ui/LogoutButton";
import { useRouter } from "next/router";

interface BlogPost {
  id: string;
  title: string;
  content: string;
  author: string;
}

export default function Dashboard() {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    author: "",
  });
  const [messages, setMessages] = useState<BlogPost[]>([]); // Använder BlogPost interface
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const router = useRouter();

  // Uppdaterad för att köra vid komponentens laddning OCH när isLoggedIn ändras
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);

    if (!isLoggedIn || !token) return;

    const fetchMessages = async () => {
      const API_URL = "http://127.0.0.1:3013/api/v1/user/blog";
      try {
        const response = await fetch(API_URL, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) {
          throw new Error("Kunde inte hämta meddelanden");
        }
        const data: BlogPost[] = await response.json();
        setMessages(data);
      } catch (error) {
        console.error("Fel vid hämtning av meddelanden", error);
      }
    };

    fetchMessages();
  }, [isLoggedIn]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };
  const handleBlogPost = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isLoggedIn) {
      console.error("Du måste logga in för att kunna skriva ett blogginlägg!");
      return;
    }

    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    if (!token) {
      console.error("Ingen token hittades i localStorage");
      return;
    }

    const API_URL = "http://127.0.0.1:3013/api/v1/user/blog";

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...formData, userId }),
      });

      if (!response.ok) {
        throw new Error("Fel vid skickande av blogginlägg");
      }

      const result = await response.json();
      console.log("Blogginlägg skickat:", result);
      setFormData({ title: "", content: "", author: "" }); // Återställ formulärdata
    } catch (error) {
      console.error(
        "Ett fel inträffade vid skickande av blogginlägget:",
        error
      );
    }
  };

  const handleLogout = async () => {
    try {
      if ("caches" in window) {
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map((name) => caches.delete(name)));
      }
      localStorage.removeItem("token");
      localStorage.removeItem("userId");

      setIsLoggedIn(false);
      router.push("/signin");
    } catch (error) {
      console.error("Ett fel uppstod under utloggningen:", error);
    }
  };
  return (
    <div className="text-white bg-gray-900 p-5">
      {" "}
      <h1 className="text-2xl font-bold mb-5">Skapa ett Blogginlägg</h1>
      {!isLoggedIn ? (
        <p>Du måste logga in för att kunna skriva ett blogginlägg!</p>
      ) : (
        <>
          <LogoutButton onLogout={handleLogout} />
          <form onSubmit={handleBlogPost} className="space-y-4">
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Titel"
              required
              className="w-full p-2 rounded-md text-black"
            />
            <input
              type="text"
              name="content"
              value={formData.content}
              onChange={handleChange}
              placeholder="Innehåll"
              required
              className="w-full p-2 rounded-md text-black" // Förbättrade Tailwind-klasser
            />
            <input
              type="text"
              name="author"
              value={formData.author}
              onChange={handleChange}
              placeholder="Författare"
              required
              className="w-full p-2 rounded-md text-black" // Förbättrade Tailwind-klasser
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-md bg-blue-500 hover:bg-blue-700 transition duration-200"
            >
              Skicka
            </button>{" "}
          </form>
          {messages.length > 0 && (
            <div className="mt-10">
              {messages.map((message, index) => (
                <div key={index} className="bg-gray-800 p-4 rounded-lg mb-4">
                  <p>{message.content}</p>{" "}
                  <p className="text-sm mt-2">Författare: {message.author}</p>{" "}
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
