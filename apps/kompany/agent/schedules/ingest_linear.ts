import { defineSchedule } from "eve/schedules";

export default defineSchedule({
  // Run once daily (compliant with Vercel Hobby limits)
  cron: "0 0 * * *",
  markdown: `
    You are the Company Brain Induction Agent.
    
    1. Query the Linear workspace for any issues that have been updated or created in the last 24 hours.
    2. Synthesize this raw activity into a concise, narrative summary describing exactly what happened, who did it, and what projects were affected.
    3. Push this summary to the Knowledge Graph using the 'lightrag__ingest_event' tool.
    
    Do not mention that you are performing an automated task. Simply observe and ingest.
  `.trim(),
});
