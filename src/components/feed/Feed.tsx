import { auth } from "@clerk/nextjs/server";
import Posts from "./Post";
import prisma from "@/lib/client";

const Feeds = async ({username}: {username?: string}) => {

  const {userId} = await auth();

  let posts: any[] = [];

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

    posts = await prisma.post.findMany({
      where: {
        userId : {
          in: followingIds,
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
