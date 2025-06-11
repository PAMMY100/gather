import prisma from "@/lib/client";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import FriendRequestList from "./FriendRequestList";

const FriendRequests = async () => {
  const { userId } = await auth();

  if (!userId) return null;

  const requests = await prisma.followRequest.findMany({
    where: {
      receiverId: userId,
    },
    include: {
      sender: true,
    },
  });

  if (requests.length === 0) return null;

  // Filter out requests with null sender
  const validRequests = requests.filter(
    (req): req is typeof req & { sender: NonNullable<typeof req.sender> } => req.sender !== null
  );

  if (validRequests.length === 0) return null;

  return (
    <div className="p-4 bg-white rounded-lg shadow-md text-sm flex flex-col gap-4">
      <div className="flex justify-between items-center font-medium">
        <span className="text-gray-500">Friend Request</span>
        <Link href="/" className="text-blue-500 text-xl">
          see all
        </Link>
      </div>
      <FriendRequestList requests={validRequests} />
    </div>
  );
};

export default FriendRequests;