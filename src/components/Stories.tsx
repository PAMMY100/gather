import prisma from "@/lib/client";
import { auth } from "@clerk/nextjs/server";
import StoryList from "./StoryList";

const Stories = async () => {
  const { userId } = await auth();


  if (!userId) {
    return null;
  }

  const stories = await prisma.story.findMany({
    where: {
      expiredAt: {
        gt: new Date(),
      },
      OR: [
        {
          user: {
            followers: {
              some: {
                followerId: userId,
              },
            },
          }
        },
        {
          userId,
        }
      ]
    },
    include: {
      user: true,
    }
  })

  return (
    <div className="p-4 bg-white rounded-lg shadow-md overflow-scroll text-sm scrollbar-hide">
      <div className="flex gap-8 w-max">
        <StoryList stories={stories} userId={userId}/>
      </div>
    </div>
  );
};

export default Stories;
