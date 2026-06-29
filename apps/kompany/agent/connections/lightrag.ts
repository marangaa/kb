import { defineOpenAPIConnection } from "eve/connections";

export default defineOpenAPIConnection({
  // Point directly to the LightRAG Python backend running locally
  spec: "http://localhost:9621/openapi.json",
  baseUrl: "http://localhost:9621",
  description: "The Company Brain. Use this to ingest new organizational knowledge into the graph.",
  // We only expose the ingest endpoint to the agent as a tool. 
  // We don't expose query because we inject memory dynamically instead.
  operations: {
    allow: ["ingest_event"]
  }
});
