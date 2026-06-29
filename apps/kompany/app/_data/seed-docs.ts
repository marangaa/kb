export interface SeedDoc {
  id: string;
  title: string;
  filename: string;
  content: string;
}

export const SEED_DOCUMENTS: SeedDoc[] = [
  {
    id: "about",
    title: "About Fasihi",
    filename: "about.md",
    content: `# About Fasihi

Fasihi is a boutique software development studio based in Nairobi, Kenya. We specialize in designing and deploying scalable AI systems, interactive visual dashboards, and custom digital products for high-growth enterprises and startups across East Africa.

Founded in 2024, our studio operates at the intersection of human-centric design and durable AI agent execution frameworks.`
  },
  {
    id: "team",
    title: "Fasihi Team",
    filename: "team.md",
    content: `# Fasihi Team & Roles

* **Richard (Studio Lead):** Directs client relations, product management, and operations at our Nairobi studio.
* **Sarah (Engineering Lead):** Directs database architectures, Postgres tuning, and backend APIs.
* **James (Frontend Engineer):** Leads Next.js layout construction, custom React interface design, and SVG visualization mapping.
* **Amina (AI Integration Specialist):** Configures agent runtime loops, tools orchestration, and RAG pipelines.`
  },
  {
    id: "products",
    title: "Fasihi Products",
    filename: "products.md",
    content: `# Fasihi Core Products

* **Voiant (Voice AI):** Natural language speech-to-text call agent. Led by Sarah.
* **Resonate (Product Feedback Analytics):** Multi-channel survey synthesis tool. Led by Amina.
* **Qualra (Customer Research):** Interactive user feedback collector. Led by Richard.
* **Finn / FinnPesa (Personal Finance):** Mobile-first personal financial manager integrated with Kenyan transaction APIs. Led by Sarah.`
  },
  {
    id: "clients",
    title: "Fasihi Clients & Partnerships",
    filename: "clients.md",
    content: `# Fasihi Clients & Partnerships

* **Safaricom (Telecommunications Partner):** Fasihi partners with Safaricom to support integration with mobile finance rails in East Africa. Our application, FinnPesa, leverages Safaricom's open APIs. Led by Sarah.
* **Nairobi County (Government Client):** Centralized municipal feedback portal utilizing our Qualra feedback engine. Led by Richard.
* **Kenya Airways (Aviation Partner):** Automated voice support assistant changing reservations via Voiant. Led by Sarah.`
  },
  {
    id: "tech_stack",
    title: "Fasihi Tech Stack",
    filename: "tech_stack.md",
    content: `# Fasihi Core Technology Stack

* **Next.js & React:** Our primary framework for rendering fast, interactive web interfaces. Led by James.
* **TypeScript:** Ensures static typing safety across client applications.
* **FastAPI & Python:** Used for running core AI engines and orchestration endpoints.
* **AWS Aurora PostgreSQL (with pgvector):** Stores relational datasets and handles high-performance semantic vector searches. Led by Sarah.
* **EVE Agent Framework:** Configures durable, session-aware agent runtimes. Led by Amina.
* **LightRAG:** Powers our incremental GraphRAG pipeline. Led by Amina.`
  },
  {
    id: "onboarding",
    title: "New Hire Onboarding",
    filename: "onboarding.md",
    content: `# Fasihi New Hire Onboarding Guide

* **Hardware Provisioning:** Apple MacBook Pro (M3 Pro). Managed by James.
* **VPN & Network Access:** Zero-trust access via Cloudflare Access. Managed by Sarah.
* **Communication Channels:** Slack (messaging), Notion (documentation), Linear (issues).
* **First Week Tasks:** Setup GitHub access, run the local repo, sync with Amina (agents) and Sarah (databases).`
  },
  {
    id: "operations",
    title: "Operations & SOPs",
    filename: "operations.md",
    content: `# Fasihi Standard Operating Procedures

* **Writing Over Talking:** Technical and design changes must be documented in Notion RFCs rather than meetings.
* **No Meeting Wednesdays:** Dedicated to deep engineering focus.
* **Public Channels First:** Avoid private DMs for project decisions; keep questions in public Slack channels.
* **Pull Request Guidelines:** All changes must go through GitHub PRs, requiring peer review (James for frontend, Sarah for DB, Amina for agents).`
  },
  {
    id: "benefits",
    title: "Benefits & Wellness",
    filename: "benefits.md",
    content: `# Fasihi Employee Benefits & Wellness

* **Medical Cover:** Full medical insurance via Jubilee Insurance for employees and dependents.
* **Paid Time Off:** 21 days vacation, 10 days sick leave, 90 days maternity, and 14 days paternity leave.
* **Learning Budget:** $1,000 annual stipend for courses or technical books. Sarah handles reimbursement requests.`
  }
];
