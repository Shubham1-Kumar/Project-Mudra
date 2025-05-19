import { getServerSession } from "next-auth";
import { authOptions } from "../auth";
import { fetchP2P } from "./fetchP2P";

interface P2PTransaction {
  id: number;
  amount: number;
  timestamp: Date;
  fromUserId: number;
  toUserId: number;
  fromUser: {
    id: number;
    name: string | null;
    number: string;
  };
  toUser: {
    id: number;
    name: string | null;
    number: string;
  };
}

// ✅ For full transaction history
export async function allP2pTransactions() {
  const session = await getServerSession(authOptions);
  const userId = Number(session?.user?.id);
  if (!userId) throw new Error("User Not Authenticated");

  try {
    const transactions = await fetchP2P(userId);
    
    // Map and format the transactions consistently
    return transactions.map((tx: P2PTransaction) => ({
      id: tx.id,
      amount: tx.amount,
      timestamp: tx.timestamp.toISOString(), // Convert to ISO string
      formattedTime: tx.timestamp.toLocaleString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      fromUserId: tx.fromUserId,
      toUserId: tx.toUserId,
      fromUser: {
        id: tx.fromUser.id,
        name: tx.fromUser.name,
        number: tx.fromUser.number
      },
      toUser: {
        id: tx.toUser.id,
        name: tx.toUser.name,
        number: tx.toUser.number
      }
    }));
  } catch (error) {
    console.error("Error while getting the transactions:", error);
    throw new Error("Error: " + (error as Error).message);
  }
}