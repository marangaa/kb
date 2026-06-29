import { defineDynamic, defineInstructions } from "eve/instructions";
import { queryCompanyBrain } from "../lib/lightrag-client.js";

export default defineDynamic({
  events: {
    "turn.started": async (_event, ctx) => {
      // Find the most recent message from the user to use as the search query
      const messages = ctx.session.messages || [];
      const lastUserMessage = messages.slice().reverse().find(msg => msg.role === "user");
      
      const queryText = typeof lastUserMessage?.content === "string" 
        ? lastUserMessage.content 
        : "";

      if (!queryText) {
        return null;
      }

      // Query the GraphRAG backend with the user's input
      const relevantContext = await queryCompanyBrain(queryText);
      
      // Inject the retrieved graph context into the model's instructions
      return defineInstructions({
        markdown: `
## Internal Company Context (GraphRAG)
The following knowledge has been retrieved from the internal Company Brain regarding the user's most recent query:

${relevantContext}

Use this knowledge to answer the user accurately. Treat this as confirmed organizational memory.
        `.trim(),
      });
    },
  },
});
