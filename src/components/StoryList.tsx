'use client'

import { addStory } from "@/lib/actions"
import { useUser } from "@clerk/nextjs"
import { Story, User } from "@prisma/client"
import { CldUploadWidget } from "next-cloudinary"
import Image from "next/image"
import { useOptimistic, useState } from "react"

type StoryWithUser = Story & {user: User}

const StoryList = ({stories, userId}: {stories: StoryWithUser[], userId: string}) => {
    const {user} = useUser()
    const [storyList, setStoryList] = useState(stories)
    const [img, setImg] = useState<any>()

    const [optimisticStory, addOptimisticStory] = useOptimistic(storyList, (state, value: StoryWithUser) => {
        return [value, ...state]
    })

    const add = async () => {
        if (!img.secure_url) return;
        
        addOptimisticStory({
            id: Math.random(),
            img: img.secure_url, // Temporary ID for optimistic update
            userId,
            createdAt: new Date(Date.now()),
            expiredAt: new Date(Date.now()+ 24*60*60*1000),
            user: {
                id: userId,
                username: "",
                name: "",
                surname:"",
                avater: user?.imageUrl || "/noAvatar.png",
                city: "",
                work: "",
                school: "",
                cover: "",
                description: "",
                website: "",
                createdAt: new Date(Date.now())
            }
        });

        try {
            const newStory = await addStory(img.secure_url);
            setStoryList((prev) => [newStory!, ...prev])
            setImg(null)

        } catch (error) {
            console.log(error)
        }
    }


  return (
    <>
        <CldUploadWidget uploadPreset="gather" onSuccess={(result, {widget}) =>{ 
              setImg(result.info);
              widget.close();
              }}>
                        {({ open }) => {
                            return (
                            <div className="flex flex-col items-center gap-2 cursor-pointer relative">
                                <Image
                                    src={img?.secure_url || user?.imageUrl || "/noAvatar.png"}
                                    alt=""
                                    width={80}
                                    height={80}
                                    className="w-20 h-20 rounded-full ring-2 ring-blue-400 object-cover"
                                    onClick={() => open()} 
                                />
                                {img ? (
                                    <form action={add}>
                                        <button className="text-xs bg-blue-500 p-1 rounded-md text-white">Send</button>
                                    </form>
                                    ): (
                                    <span className="font-medium">Add a Story</span>
                                    )}
                                <div className="absolute text-6xl text-gray-200 top-1">+</div>
                            </div>
                            );
                        }}
          </CldUploadWidget>
        {optimisticStory.map((story) => (
            <div className="flex flex-col items-center gap-2 cursor-pointer" key={story.id}>
                <Image
                    src={story.user.avater || "/noAvatar.png"}
                    alt=""
                    width={80}
                    height={80}
                    className="w-20 h-20 rounded-full ring-2 ring-blue-400"
                />
                <span className="font-medium">{story.user.username || story.user.name}</span>
            </div>
        ))}
    </>
  )
}

export default StoryList