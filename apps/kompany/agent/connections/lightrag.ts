import { defineOpenAPIConnection } from "eve/connections";

const baseUrl = process.env.LIGHTRAG_API_URL || "http://localhost:8020";

export default defineOpenAPIConnection({
  spec: `${baseUrl}/openapi.json`,
  baseUrl: baseUrl,
  description: "The Company Brain. Use this to ingest new organizational knowledge into the graph.",
  operations: {
    allow: ["ingest_event"]
  }
});
