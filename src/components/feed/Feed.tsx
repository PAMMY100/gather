import { auth } from "@clerk/nextjs/server";
import Posts from "./Post";
import prisma from "@/lib/client";
import { Post, User } from "@prisma/client";

type PostWithExtras = Post & {
  user: User;
  likes: { userId: string }[];
  _count: {
    comments: number;
  };
};

const Feeds = async ({username}: {username?: string}) => {

  const {userId} = await auth();

  let posts: PostWithExtras[] = [];

  if (username) {
    posts = await prisma.post.findMany({
      where: {
        user: {
          username: username,
        },
      },
      include: {
        user: true,
        likes: {
          select: {
            userId: true,
          }
        },
        _count: {
          select: {
            comments: true,
          
          }
        }
      }, 
      orderBy: {
        createdAt: 'desc',
      }
    })
  }

  if (!username && userId) {
    const following = await prisma.follower.findMany({
      where: {
        followerId: userId,
      },
      select: {
        followingId: true,
      }
    })

    const followingIds = following.map(f => f.followingId).filter((id): id is string => id !== null);

    const ids = [userId, ...followingIds];

    posts = await prisma.post.findMany({
      where: {
        userId : {
          in: ids,
        },
      },
      include: {
        user: true,
        likes: {
          select: {
            userId: true,
          }
        },
        _count: {
          select: {
            comments: true,
          }
        }
      },
      orderBy: {
        createdAt: 'desc',
      }
    })
  }


  return (
    <div className="p-4 bg-white shadow-md rounded-lg flex flex-col gap-12">
      {posts && posts.length > 0 ? (
        posts.map((post) => (
          <Posts key={post.id} post={post} />
        ))
      ) : (
      <div className="text-center text-gray-500">
        {username ? `${username} has no posts yet` : "You have no posts yet"} </div>)
        }
    </div>
  )
};

export default Feeds;
