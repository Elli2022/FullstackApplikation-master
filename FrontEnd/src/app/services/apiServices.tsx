// apiService.tsx
export const fetchData = async (path: string) => {
  const token = localStorage.getItem("token");
  const response = await fetch(`http://127.0.0.1:3013/api/${path}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("API-förfrågan misslyckades");
  }

  return await response.json();
};
