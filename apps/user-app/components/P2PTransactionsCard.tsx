import { p2pTransactions } from "../app/lib/actions/p2pTransactions";
import { Card } from "@repo/ui/card";
import { getServerSession } from "next-auth";

export async function P2pTransactionCard() {
  const session = await getServerSession();
  if(!session || !session.user) return <div>Unauthenticated</div>
  const transactions = await p2pTransactions();
  
  if (!transactions.length) {
    return (
      <Card title="Recent P2P Transactions">
        <div className="text-center py-8">
          <p className="text-gray-500">No transactions yet</p>
          <p className="text-sm text-gray-400 mt-1">Your P2P transactions will appear here</p>
        </div>
      </Card>
    );
  }

  return (
    <Card title="Recent P2P Transactions" className="max-w-2xl mx-auto">
      <div className="divide-y divide-gray-100">
        {transactions.map((tx:any) => {
            //@ts-ignore
          const isSent = tx.fromUserId === Number(session?.user?.id);
          const time = new Date(tx.timestamp??"Not Found").toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          });
          
          return (
            <div key={tx.id} className="py-3 px-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    isSent ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
                  }`}>
                    {isSent ? (
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="22" y1="2" x2="11" y2="13"></line>
                        <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
                      </svg>
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {isSent ? 'Sent to' : 'Received from'} {isSent ? tx.toUser?.name : tx.fromUser?.name}
                    </p>
                    <p className="text-sm text-gray-500">{time}</p>
                  </div>
                </div>
                <div className={`font-semibold ${isSent ? 'text-red-600' : 'text-green-600'}`}>
                  {isSent ? '-' : '+'}₹{tx.amount}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}