"use client"

import Image from "next/image"
import { useAuth } from "@clerk/nextjs"
import { useOptimistic, useState } from "react"
import { switchLike } from "@/lib/actions"

const PostInteraction = ({postId, likes, commentNumber}: {postId: number, likes: string[], commentNumber: number}) => {
  
    const {userId} = useAuth()

    const [likeState, setIsLikeState] = useState({
        likesCount: likes.length,
        isLiked: userId ? likes.includes(userId) : false
    })

    const [optmisticLike, setOpimisticLike] = useOptimistic(likeState, (state) => {
        return {
            ...state,
            likesCount: state.isLiked ? state.likesCount -1 : state.likesCount + 1,
            isLiked: !state.isLiked
        }
    })

    const likeAction = async () => {
        setOpimisticLike('')
        try {
            switchLike(postId)
            setIsLikeState(prev => ({
                ...prev,
                likesCount: prev.isLiked ? prev.likesCount - 1 : prev.likesCount + 1,
                isLiked: !prev.isLiked
            }))
        } catch (error) {
            console.log(error)
        }
    }
  
    return (
    <div className="flex items-center justify-between text-sm my-4">
        <div className="flex gap-8">
          <div className="flex items-center gap-4 bg-slate-50 p-2 rounded-xl">
            <form action={likeAction}>
                <button>
                    <Image
                    src={optmisticLike.isLiked ? "/liked.png" : "/like.png"}
                    alt=""
                    width={16}
                    height={16}
                    className="cursor-pointer"
                    />
                </button>
            </form>
            <span className="text-gray-300">|</span>
            <span className="text-gray-500">
              {optmisticLike.likesCount} <span className="hidden md:inline"> Likes</span>
            </span>
          </div>
          <div className="flex items-center gap-4 bg-slate-50 p-2 rounded-xl">
            <Image
              src="/comment.png"
              alt=""
              width={16}
              height={16}
              className="cursor-pointer"
            />
            <span className="text-gray-300">|</span>
            <span className="text-gray-500">
              {commentNumber} <span className="hidden md:inline"> Comments</span>
            </span>
          </div>
        </div>
        <div className="">
          <div className="flex items-center gap-4 bg-slate-50 p-2 rounded-xl">
            <Image
              src="/share.png"
              alt=""
              width={16}
              height={16}
              className="cursor-pointer"
            />
            <span className="text-gray-300">|</span>
            <span className="text-gray-500 flex">
              <span className="hidden md:inline">share</span>
            </span>
          </div>
        </div>
      </div>
  )
}

export default PostInteraction