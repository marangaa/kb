export async function GET() {
  try {
    const baseUrl = process.env.LIGHTRAG_API_URL || "http://127.0.0.1:8020";
    const res = await fetch(`${baseUrl}/graph`);
    if (!res.ok) {
      throw new Error(`Failed to fetch graph from backend: ${res.statusText}`);
    }
    const data = await res.json();
    return Response.json(data);
  } catch (error) {
    console.error("Next.js API /api/graph error:", error);
    return Response.json({ error: String(error) }, { status: 500 });
  }
}
