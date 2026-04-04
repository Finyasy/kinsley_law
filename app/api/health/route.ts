import { NextResponse } from "next/server";
import { getDatabaseHealth } from "@/lib/persistence";

export async function GET() {
  const database = await getDatabaseHealth();
  const isHealthy = database.configured ? database.reachable : true;

  return NextResponse.json(
    {
      ok: isHealthy,
      service: "kinsley-law",
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      database,
    },
    {
      status: isHealthy ? 200 : 503,
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    },
  );
}
