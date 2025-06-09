'use client'

import { addComment } from "@/lib/actions"
import { useUser } from "@clerk/nextjs"
import { Comment, User } from "@prisma/client"
import Image from "next/image"
import { useOptimistic, useState } from "react"
import { date } from "zod/v4"

type CommentType = Comment & { user: User }

const CommentList = ({comments, postId}: {comments: CommentType[], postId: number}) => {
   const {user}  = useUser()
   const [commentState, setCommentState] = useState(comments);
   const [desc, setDesc] = useState("");

   const [optimisticComment, setOptimisicComment] = useOptimistic(commentState, (state, value: CommentType) => {
        return [value, ...state]
   })

   const add = async () => {
     if (!user || !desc) return;
     try {
        setOptimisicComment({
            id: Math.random(), // Temporary ID for optimistic update
            postId: postId,
            userId: user.id,
            desc: desc,
            createdAt: new Date(Date.now()),
            updatedAt: new Date(Date.now()),
            user: {
                id: user.id,
                username: "",
                name: "",
                surname:"",
                avater: user.imageUrl || "/noAvatar.png",
                city: "",
                work: "",
                school: "",
                cover: "",
                description: "",
                website: "",
                createdAt: new Date(Date.now())
            }
        })

        const newComment = await addComment(postId, desc);
        if (newComment) {
          setCommentState((prev) => [newComment, ...prev]);
        }
     } catch (error) {
        console.log(error)
     }
   }
   

  return (
    <div>
        {user && <div className="flex-1 flex items-center gap-4">
        <Image
          src={user.imageUrl || "/noAvatar.png"}
          alt=""
          width={32}
          height={32}
          className="w-8 h-8 rounded-full"
        />
        <div className="flex items-center justify-between bg-slate-100 rounded-xl text-sm px-6 py-2 w-full">
          <form action={add}>
            <input
                type="text"
                placeholder="write a comment..."
                className="bg-transparent outline-none flex-1"
                onChange={(e) => setDesc(e.target.value)}
            />
            <Image
                src="/emoji.png"
                alt=""
                width={16}
                height={16}
                className="cursor-pointer"
            />
          </form>
        </div>
      </div> }
      {/* Comments */}
      <div className="">
        {/* Comment */}
        {optimisticComment.map((comment) => (
            <div className="flex gap-4 justify-between mt-6" key={comment.id}>
          {/* Avatar */}
          <Image
            src={comment.user.avater || "/noAvatar.png"}
            alt=""
            width={40}
            height={40}
            className="w-10 h-10 rounded-full"
          />
          {/* DESC */}
          <div className="flex flex-col gap-2 flex-1">
            <span className="font-medium">{comment.user.name && comment.user.surname ? comment.user.name + " " + comment.user.surname : comment.user.username}</span>
            <p>
              {comment.desc}
            </p>
            <div className="flex items-center gap-8 text-xs text-gray-500 mt-2">
              <div className="flex items-center gap-4">
                <Image
                  src="/like.png"
                  alt=""
                  width={12}
                  height={12}
                  className="cursor-pointer w-3 h-3"
                />
                <span className="text-gray-300">|</span>
                <span className="text-gray-500">123 Likes</span>
              </div>
              <div className="">Reply</div>
            </div>
          </div>
          {/* ICON */}
          <Image
            src="/more.png"
            alt=""
            width={16}
            height={16}
            className="cursor-pointer w-4 h-4"
          />
        </div>
        ))}
      </div>
    </div>
  )
}

export default CommentList