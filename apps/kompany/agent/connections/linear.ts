import { connect } from "@vercel/connect/eve";
import { defineMcpClientConnection } from "eve/connections";

export default defineMcpClientConnection({
  url: "https://mcp.linear.app/mcp",
  description: "Linear workspace: read the organization's issues, projects, cycles, and comments.",
  
  // App-Scoped authentication. Eve fetches a single shared token to observe 
  // the entire organization's workspace, without needing individual user login.
  auth: connect({ connector: "mcp.linear.app/linear", principalType: "app" }),
  
  // Only allow reading tools, preventing the background agent from destroying data
  tools: {
    allow: ["search_issues", "get_issue", "get_project", "search_projects"]
  }
});
