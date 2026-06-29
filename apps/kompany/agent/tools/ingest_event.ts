import { defineTool } from "eve/tools";
import { z } from "zod";
import { logger } from "../lib/logger.js";

export default defineTool({
  description: "Ingest a new event or document into the Company Brain (GraphRAG) so it is remembered in the knowledge graph.",
  inputSchema: z.object({
    source: z.string().describe("The source of the event (e.g., 'slack', 'linear', 'notion', 'user')"),
    content: z.string().describe("The full text content of the event or document to ingest."),
    metadata: z.record(z.any()).default({}).describe("Any additional metadata, e.g., author, channel, timestamp."),
  }),
  async execute({ source, content, metadata }) {
    try {
      const response = await fetch("http://127.0.0.1:8020/ingest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ source, content, metadata }),
      });

      if (!response.ok) {
        throw new Error(`Failed to ingest to GraphRAG: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      logger.error({ err: error, source }, "GraphRAG Ingest Error");
      return { error: String(error) };
    }
  },
});
