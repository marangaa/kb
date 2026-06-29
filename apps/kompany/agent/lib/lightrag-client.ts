export async function queryCompanyBrain(query: string): Promise<string> {
  try {
    const response = await fetch("http://localhost:9621/query", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, mode: "hybrid" })
    });
    
    if (!response.ok) {
      console.warn(`LightRAG query failed: ${response.statusText}`);
      return "No relevant context found in the Company Brain due to a connection error.";
    }
    
    const data = await response.json();
    return data.answer || "No relevant context found.";
  } catch (err) {
    console.error("Failed to query LightRAG:", err);
    return "No relevant context found in the Company Brain due to a network error.";
  }
}
