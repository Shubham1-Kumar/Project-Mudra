import db from "@repo/db/client";
// 🔁 Common fetch function
export async function fetchP2P(userId: number, take?: number) {
  const result =  await db.p2pTransfer.findMany({
    where: {
      OR: [
        { fromUserId: userId },
        { toUserId: userId },
      ],
    },
    orderBy: {
      timestamp: "desc",
    },
    take, // undefined = no limit
    include: {
      fromUser: {
        select: {
          id: true,
          name: true,
          email: true,
          number: true,
        },
      },
      toUser: {
        select: {
          id: true,
          name: true,
          email: true,
          number: true,
        },
      },
    },
  });
  return result;
}

