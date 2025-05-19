import { getServerSession } from "next-auth";
import { authOptions } from "../auth";
import { fetchP2P } from "./fetchP2P";

export async function p2pTransactions() {
  const session = await getServerSession(authOptions);
  const userId = Number(session?.user?.id);
  if (!userId) throw new Error("User Not Authenticated");

  try {
    const transactions = await fetchP2P(userId, 5);
    return transactions;
  } catch (error) {
    console.error("Transaction error:", error);
    throw new Error("Failed to fetch transactions");
  }
}
