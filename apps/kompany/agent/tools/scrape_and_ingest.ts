import { defineTool } from "eve/tools";
import { z } from "zod";
import { Firecrawl } from "firecrawl";
import { logger } from "../lib/logger.js";

export default defineTool({
  description: "Scrape a given URL to extract information and automatically ingest it into the Company Brain (GraphRAG). Use this when you need to learn about a company, product, or person from their website.",
  inputSchema: z.object({
    url: z.string().url().describe("The URL to scrape and ingest."),
  }),
  async execute({ url }) {
    logger.info({ url }, "Starting scrape for URL");
    
    const app = new Firecrawl();

    try {
      const scrapeResult = await app.scrape(url, { formats: ['markdown'] });
      const markdown = scrapeResult.markdown;
      
      if (!markdown) {
         throw new Error("No markdown content returned from Firecrawl.");
      }

      logger.info("Ingesting to GraphRAG backend...");

      // Ingest to LightRAG
      const response = await fetch("http://127.0.0.1:8020/ingest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          source: `firecrawl_scrape_${url}`,
          content: markdown,
          metadata: {
            url: url,
            scrapedAt: new Date().toISOString()
          }
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to ingest to GraphRAG: ${response.statusText}`);
      }

      const data = await response.json();
      logger.info({ url }, "GraphRAG ingestion successful.");
      
      return { 
        status: "success", 
        message: `Successfully scraped ${url} and ingested into Company Brain.`,
        graphrag_response: data 
      };
    } catch (error) {
      logger.error({ err: error, url }, "Scrape and ingest failed");
      return { error: String(error) };
    }
  },
});
