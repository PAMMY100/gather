import Feed from "@/components/Feed";
import LeftMenu from "@/components/LeftMenu";
import RightMenu from "@/components/RightMenu";
import prisma from "@/lib/client";
import { auth } from "@clerk/nextjs/server";
import Image from "next/image";
import { notFound } from "next/navigation";

const Page = async ({ params }: {params: {username: string}}) => {

 const { username } = await params;


  if (!username) {
    return <div className="text-center">Username is required</div>;
  }

  const user = await prisma.user.findFirst({
    where: {
      username,
    },
    include: {
      posts: true,
      _count: {
        select: {
          posts: true,
          followers: true,
          followings: true,
        }
      }
    }
  })

  if (!user) return notFound()

  const {userId: currentUserId} = await auth();

  let isBlocked;

  if (currentUserId) {
    const res = await prisma.block.findFirst({
      where: {
        blockerId: user.id,
        blockedId: currentUserId,
      }
    })
    if (res) isBlocked = true;
  } else {
    isBlocked = false;
  }

  if (isBlocked) return notFound();

  return (
    <div className="flex gap-6 pt-6">
      <div className="hidden xl:block w-[20%]">
        <LeftMenu type="profile" />
      </div>
      <div className="w-full lg:w-[70%] xl:w-[50%]">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col items-center justify-center">
            <div className="w-full h-64 relative">
              <Image
                src="https://images.pexels.com/photos/31638047/pexels-photo-31638047/free-photo-of-calm-lighthouse-overlooking-normandy-coast.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load"
                alt=""
                fill
                className="object-cover rounded-md"
              />
              <Image
                src="https://images.pexels.com/photos/19129375/pexels-photo-19129375/free-photo-of-fish-in-nature.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load"
                alt=""
                width={128}
                height={128}
                className="rounded-full h-32 w-32 absolute left-0 right-0 m-auto -bottom-16 ring-4 ring-white object-cover"
              />
            </div>
            <h1 className="mt-20 mb-4 text-2xl font-medium">{(user.name && user.surname) ? user.name + " " + user.surname : user.name}</h1>
            <div className="flex items-center justify-center gap-12 mb-4">
              <div>
                <span className="">{user._count.posts}</span>
                <span className="text-sm">Posts</span>
              </div>
              <div>
                <span className="">{user._count.followers}</span>
                <span className="text-sm">Followers</span>
              </div>
              <div>
                <span className="">{user._count.followings}</span>
                <span className="text-sm">Following</span>
              </div>
            </div>
          </div>
          <Feed />
        </div>
      </div>
      <div className="hidden lg:block w-[30%]">
        <RightMenu user={user} />
      </div>
    </div>
  );
};

export default Page;
