// src/pages/dashboard.tsx
import React, { useState, useEffect } from "react";
import LogoutButton from "../components/ui/LogoutButton";
import { useRouter } from "next/router";

interface BlogPost {
  _id: string;
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

  console.log("isLoggedIn status:", isLoggedIn);

  // Uppdaterad för att köra vid komponentens laddning OCH när isLoggedIn ändras
  useEffect(() => {
    console.log("Effekt körs, isLoggedIn:", isLoggedIn);
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
    console.log("Token från localStorage:", token);

    if (!isLoggedIn || !token) {
      console.log("Användare inte inloggad eller token saknas");
      return;
    }

    const fetchMessages = async () => {
      const API_URL = "http://127.0.0.1:3013/api/v1/user/blog";
      console.log("Försöker hämta meddelanden från API");
      try {
        const response = await fetch(API_URL, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) {
          throw new Error("Kunde inte hämta meddelanden");
        }
        const result = await response.json();
        console.log("Svar från API:", result);
        if (result.err === 0 && Array.isArray(result.data)) {
          setMessages(result.data);
        } else {
          console.error("Oväntat svarsformat från API", result);
        }
      } catch (error) {
        console.error("Fel vid hämtning av meddelanden", error);
      }
    };

    fetchMessages();
  }, [isLoggedIn]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
    console.log("Formulärdata uppdaterad:", name, value);
  };

  const handleBlogPost = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Försöker posta nytt blogginlägg:", formData);
    if (!isLoggedIn) {
      console.error("Du måste logga in för att kunna skriva ett blogginlägg!");
      return;
    }

    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    console.log("AnvändarID och token:", userId, token);
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
      console.log("Blogginlägg skickat, respons från server:", result);
      setFormData({ title: "", content: "", author: "" }); // Återställer formulärdata
    } catch (error) {
      console.error(
        "Ett fel inträffade vid skickande av blogginlägget:",
        error
      );
    }
  };

  const handleLogout = async () => {
    console.log("Loggar ut användare");
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

  console.log(messages);
  console.log("Före rendering, messages:", messages);

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
              className="w-full p-2 rounded-md text-black"
            />
            <input
              type="text"
              name="author"
              value={formData.author}
              onChange={handleChange}
              placeholder="Författare"
              required
              className="w-full p-2 rounded-md text-black"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-md bg-blue-500 hover:bg-blue-700 transition duration-200"
            >
              Skicka
            </button>{" "}
          </form>
          {messages.length > 0 && (
            <div className="mt-10 text-white">
              {messages.map((message) => (
                <div
                  key={message._id}
                  className="text-white p-4 rounded-lg mb-4"
                >
                  <h2 className="text-white">{message.title}</h2>
                  <p>{message.content}</p>
                  <p className="text-sm mt-2">Författare: {message.author}</p>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
