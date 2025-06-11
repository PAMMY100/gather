'use client';

import { acceptFollowRequest } from "@/lib/actions";
import { FollowRequest, User } from "@prisma/client";
import Image from "next/image";
import { useOptimistic, useState } from "react";

type RequestWithUser = FollowRequest & {
  sender: User; // sender is now always User, as we'll filter nulls
};

const FriendRequestList = ({ requests }: { requests: RequestWithUser[] }) => {
  // Filter out requests with null sender
  const validRequests = requests.filter((req) => req.sender !== null);
  const [requestState, setRequestState] = useState<RequestWithUser[]>(validRequests);

  const [optimisticRequests, removeOptimisticRequest] = useOptimistic(
    requestState,
    (state, value: number) => state.filter((req) => req.id !== value)
  );

  const accept = async (requestId: number, userId: string | null) => {
    if (!userId) return; // Guard against null userId
    removeOptimisticRequest(requestId);
    try {
      await acceptFollowRequest(userId);
      setRequestState((prev) => prev.filter((req) => req.id !== requestId));
    } catch (error) {
      console.log(error);
    }
  };

  const reject = async (requestId: number, userId: string | null) => {
    if (!userId) return; // Guard against null userId
    removeOptimisticRequest(requestId);
    try {
      // TODO: Replace with rejectFollowRequest when implemented
      await acceptFollowRequest(userId); // Note: This should be rejectFollowRequest
      setRequestState((prev) => prev.filter((req) => req.id !== requestId));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      {optimisticRequests.map((request) => (
        <div className="flex items-center justify-between" key={request.id}>
          <div className="flex items-center gap-4">
            <Image
              src={request.sender.avater || "/noAvatar.png"} // No null check needed
              alt=""
              width={40}
              height={40}
              className="w-10 h-10 rounded-full object-cover"
            />
            <span className="semi-bold">
              {(request.sender.name && request.sender.surname)
                ? `${request.sender.name} ${request.sender.surname}`
                : request.sender.username}
            </span>
          </div>
          <div className="flex gap-3 justify-end">
            <form action={() => accept(request.id, request.sender.id)}>
              <button>
                <Image
                  src="/accept.png"
                  alt=""
                  width={20}
                  height={20}
                  className="cursor-pointer"
                />
              </button>
            </form>
            <form action={() => reject(request.id, request.sender.id)}>
              <button>
                <Image
                  src="/reject.png"
                  alt=""
                  width={20}
                  height={20}
                  className="cursor-pointer"
                />
              </button>
            </form>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FriendRequestList;