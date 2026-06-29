import { defineInstrumentation } from "eve/instrumentation";
import { registerOTel } from "@vercel/otel";

/**
 * OpenTelemetry Instrumentation Configuration
 * 
 * This file replaces console.log by exporting standard AI SDK traces to Vercel/OTel.
 * Every model call, tool execution, and token count will be perfectly traced
 * in the dashboard automatically.
 */
export default defineInstrumentation({
  setup: ({ agentName }) =>
    registerOTel({
      serviceName: agentName,
    }),
});
