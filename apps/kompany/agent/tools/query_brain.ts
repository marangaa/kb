import { defineTool } from "eve/tools";
import { z } from "zod";

export default defineTool({
  description: "Query the Company Brain (GraphRAG) to retrieve organizational knowledge, decisions, or context. Use this to answer any question about the company.",
  inputSchema: z.object({
    query: z.string().describe("The question or topic to search for in the knowledge graph."),
    mode: z.enum(["naive", "local", "global", "hybrid"]).default("hybrid").describe("The search mode. Hybrid is best for general questions. Global for high-level summaries. Local for specific entity details."),
  }),
  async execute({ query, mode }) {
    try {
      const response = await fetch("http://127.0.0.1:8020/query", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query, mode }),
      });

      if (!response.ok) {
        throw new Error(`Failed to query GraphRAG: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("GraphRAG Query Error:", error);
      return { error: String(error) };
    }
  },
});
