import prisma from "@/lib/client";
import { auth } from "@clerk/nextjs/server";
import Image from "next/image";

const ProfileCard = async () => {

  const {userId} = await auth()

  if (!userId) return null; // or handle unauthenticated state

  const user = await prisma.user.findFirst({
    where: {
      id: userId
    }, 
    include:{
      _count: {
        select: {
          followers: true
        }
      }
    }
  })

  console.log("User:", user);

  if (!user) return null; // or handle case where user is not found

  return (
    <div className="p-4 bg-white rounded-lg shadow-md text-sm flex flex-col gap-6">
      <div className="h-20 relative">
        <Image
          src={user?.cover || "/noCover2.jpeg"}
          alt=""
          fill
          className="rounded-md object-cover"
        />
        <Image
          src={user?.avater || "/noAvatar.png"}
          alt=""
          width={48}
          height={48}
          className="rounded-full w-12 h-12 object-cover absolute left-0 right-0 m-auto -bottom-6 ring-1 ring-white z-10"
        />
      </div>
      <div className="h-20 flex flex-col gap-2 items-center">
        <span className="font-semibold">{(user.name && user.surname) ? user.name + " " + user.surname : user.username}</span>
        <div className="flex items-center gap-4">
          <div className="flex">
            <Image
              src="https://images.pexels.com/photos/20448107/pexels-photo-20448107/free-photo-of-brunette-woman-holding-a-bouquet-of-white-flowers.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load"
              alt=""
              width={12}
              height={12}
              className="rounded-full w-3 h-3"
            />
            <Image
              src="https://images.pexels.com/photos/20448107/pexels-photo-20448107/free-photo-of-brunette-woman-holding-a-bouquet-of-white-flowers.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load"
              alt=""
              width={12}
              height={12}
              className="rounded-full w-3 h-3"
            />
            <Image
              src="https://images.pexels.com/photos/20448107/pexels-photo-20448107/free-photo-of-brunette-woman-holding-a-bouquet-of-white-flowers.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load"
              alt=""
              width={12}
              height={12}
              className="rounded-full w-3 h-3"
            />
          </div>
          <span className="text-sm tex-gray-500">{user._count.followers}</span>
        </div>
        <button className="bg-blue-500 text-white text-xs p-2 rounded-md">
          My Profile
        </button>
      </div>
    </div>
  );
};

export default ProfileCard;
