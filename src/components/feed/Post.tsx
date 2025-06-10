import Image from "next/image";
import Comments from "./Comments";
import { Post, User } from "@prisma/client";
import PostInteraction from "./PostInteraction";
import { Suspense } from "react";
import MoreInteraction from "./MoreInteraction";
import { auth } from "@clerk/nextjs/server";



type PostType = Post & {user: User} & {likes: [{userId: string}] | null} & {_count: {comments: number}}

const Posts =async  ({post}:{post: PostType}) => {
  const {userId}  = await auth()

  return (
    <div className="flex flex-col gap-4">
      {/* User */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Image
            src={post.user.avater || "/noAvatar.png"}
            alt=""
            width={40}
            height={40}
            className="w-10 h-10 rounded-full"
          />
          <span className="font-medium">{(post.user.name && post.user.surname) ? post.user.name + " " + post.user.surname : post.user.username}</span>
        </div>
        {userId === post.user.id && <MoreInteraction postId={post.id} />}
      </div>
      {/* Desc */}
      <div className="flex flex-col gap-4">
        {post.img && <div className="w-full min-h-96 relative">
          <Image
            src={post.img}
            alt=""
            fill
            className="object-cover rounded-md"
          />
        </div>}
        <p>
          {post.desc}
        </p>
      </div>
      {/* Interaction */}
      <Suspense fallback={<span>Loading...</span>}>
        <PostInteraction postId={post.id} likes={post.likes?.map(likes => likes.userId) ?? []} commentNumber={post._count.comments}/>
      </Suspense>
      <Suspense fallback={<span>Loading...</span>}>
        <Comments postId={post.id}/>
      </Suspense>
    </div>
  );
};

export default Posts;
