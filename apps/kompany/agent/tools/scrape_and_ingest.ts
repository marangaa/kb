import { defineTool } from "eve/tools";
import { z } from "zod";
import { Firecrawl } from "firecrawl";
import { logger } from "../lib/logger.js";

export default defineTool({
  description: "Scrape a given URL to extract information and automatically ingest it into Kompany (GraphRAG). Use this when you need to learn about a company, product, or person from their website.",
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

      logger.info({ url, length: markdown.length }, "Scrape successful, sending to LightRAG");

      // Now we ingest it directly into GraphRAG
      const ingestResponse = await fetch("http://127.0.0.1:8020/ingest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: url,
          content: markdown,
          metadata: { type: "website_scrape", url }
        }),
      });

      if (!ingestResponse.ok) {
         throw new Error(`LightRAG ingest failed: ${ingestResponse.statusText}`);
      }
      
      logger.info({ url }, "Ingest successful");
      return { 
        success: true, 
        message: `Successfully scraped ${url} and ingested into Kompany.`,
        contentPreview: markdown.substring(0, 200) + "..."
      };
    } catch (error) {
      logger.error({ err: error, url }, "Scrape and ingest failed");
      return { error: String(error) };
    }
  },
});
