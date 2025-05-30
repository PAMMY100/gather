'use client'

import { switchBlock, switchFollow } from "@/lib/actions"
import { useOptimistic, useState } from "react"

const UserInfoCardInteraction = ({userId,isUserBlocked,isFollowing,isFollowingSent}: {userId: string, 
          isUserBlocked: boolean,
          isFollowing: boolean,
          isFollowingSent: boolean}) => {
            const [userState, setUserState] = useState({
                following: isFollowing,
                blocked: isUserBlocked,
                followRequestSent: isFollowingSent,
            })
            const [loading, setLoading] = useState(false)

            const handleFollow = async () => {
                setLoading(true)
                switchOptimisticState('follow')
                try {
                    await switchFollow(userId)
                    setUserState((prev) => ({
                        ...prev,
                        following: !prev.following,
                        followRequestSent: !prev.followRequestSent,
                    }))
                    setLoading(false)
                } catch (err) {
                    console.log(err);
                }
            }

        const handleBlock = async () => {
            setLoading(true);
            switchOptimisticState('block');
            try {
                await switchBlock(userId);
                setUserState((prev) => ({
                    ...prev,
                    blocked: !prev.blocked,
                }))
                setLoading(false);
            } catch (error) {
                console.log(error);
            }
        }

        const [optimisticState, switchOptimisticState] = useOptimistic(userState, (state, value : "follow" | "block") => 
            value === "follow" ?{
            ...state,
            following: !state.following,
            followRequestSent: !state.followRequestSent,
        } : {...state, blocked: !state.blocked }
     )

  return (
    <>
    <form action={handleFollow}>
        <button className="w-full bg-blue-500 text-white rounded-md p-2 text-sm cursor-pointer" disabled={loading}>
          {loading ? "loading..." : optimisticState.following ? "Following" : optimisticState.followRequestSent ? "Follow Request Sent" : "Follow"}
        </button>
    </form>
    <form action={handleBlock} className="self-end" >
        <button disabled={loading}>
            <span className="text-red-400 text-xs cursor-pointer">
            {loading ? 'loading...' : optimisticState.blocked  ? "Unblock User" : "Block User"}
            </span>
        </button>
    </form>
    </>
  )
}

export default UserInfoCardInteraction