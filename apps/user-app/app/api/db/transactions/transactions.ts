// app/api/p2p-transfers/route.ts

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { fetchP2P } from "../../../lib/actions/fetchP2P";
import { authOptions } from "../../../lib/auth";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const takeParam = searchParams.get("take");
  const take = takeParam ? parseInt(takeParam, 10) : undefined;

  try {
    const data = await fetchP2P(Number(session.user.id), take);
    return NextResponse.json(data);
  } catch (error) {
    console.error("Failed to fetch P2P transfers:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
