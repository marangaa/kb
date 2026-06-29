export async function queryKompany(query: string): Promise<string> {
  try {
    const baseUrl = process.env.LIGHTRAG_API_URL || "http://127.0.0.1:8020";
    const response = await fetch(`${baseUrl}/query`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      return "No relevant context found in Kompany due to a connection error.";
    }

    const data = await response.json();
    return data.answer || "No relevant context found.";
  } catch (error) {
    return "No relevant context found in Kompany due to a network error.";
  }
}
