"use server"

import { auth } from "@clerk/nextjs/server"
import prisma from "./client";
import { object, success } from "zod/v4";
import { updateProfileSchema } from "./validation";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export const switchFollow = async (userId: string) => {
    const {userId: currentUserId} = await auth();

    if (!currentUserId) {
        throw new Error("User not authenticated");
    }

    try {
        const existingFollow = await prisma.follower.findFirst({
            where: {
                followerId: currentUserId,
                followingId: userId,
            }
        })

        if (existingFollow) {
            await prisma.follower.delete({
                where: {
                    id: existingFollow.id,
                }
            })
        } else {
           const followReq = await prisma.followRequest.findFirst({
                where: {
                    senderId: currentUserId,
                    receiverId: userId,
                }
            })

            if (followReq) {
                await prisma.followRequest.delete({
                    where: {
                        id: followReq.id,
                    }
                })
            } else {
                await prisma.followRequest.create({
                    data: {
                        senderId: currentUserId,
                        receiverId: userId,
                    }
                })
            }
        }

    
    } catch (error) {
        console.log("Error switching follow status:", error);
        throw new Error("Failed to switch follow status");
    }
}


export const switchBlock  = async (userId: string) => {
    const {userId: currentUserId} = await auth();
    if (!currentUserId) {
        throw new Error("User not authenticated");
    }

    try {

        const existingBlock = await prisma.block.findFirst({
            where: {
                blockerId: currentUserId,
                blockedId: userId,
            }
        })
        if (existingBlock) {
            await prisma.block.delete({
                where: {
                    id: existingBlock.id
                }
            })
        } else {
            await prisma.block.create({
                data: {
                    blockerId: currentUserId,
                    blockedId: userId,
                }
            })
        }

    } catch (error) {
        console.log(error);
        throw new Error("something went wrong");
    }
}

export const acceptFollowRequest = async (userId: string) => {

    const {userId: currentUserId} = await auth();
    if (!currentUserId) throw new Error("User not authenticated");
    try {
        const existingfollowRequest = await prisma.followRequest.findFirst({
            where: {
                senderId: userId,
                receiverId: currentUserId,
            }
        })
        if (existingfollowRequest) {
            await prisma.followRequest.delete({
                where:{
                    id: existingfollowRequest.id
                }
            })
            await prisma.follower.create({
                data: {
                    followerId: userId,
                    followingId: currentUserId,
                }
            })
        }     

    } catch (err) {
        console.log(err);
        throw new Error("something went wrong");
    }
}


export const rejectFollowRequest = async (userId: string) => {
    const {userId: currentUserId} = await auth();

    if (!currentUserId) throw new Error("User not authenticated");

    try {
        const existingFollowRequest = await prisma.followRequest.findFirst({
            where: {
                senderId: userId,
                receiverId: currentUserId,
            }
        })

        if (existingFollowRequest) {
            await prisma.followRequest.delete({
                where: {
                    id: existingFollowRequest.id
                }
            })
        }

    } catch (err) {
        console.log(err);
        throw new Error("something went wrong");
    }
}


export const updateProfile = async (prevState: {success: boolean, error: boolean}, payload: {formData: FormData, cover: string}) => {

    const {formData, cover} = payload;
    const fields = Object.fromEntries(formData) ;

    const filteredFields = Object.fromEntries(
        Object.entries(fields).filter(([_, value]) => value !== "")
    )

    console.log(fields);

    const validFields = updateProfileSchema.safeParse({cover, ...filteredFields});

    if (!validFields.success) {
        console.log(validFields.error.flatten().fieldErrors);
        return {success: false, error: true};
    }

    const {userId: currentUserId} = await auth();

    if (!currentUserId) {
        return {success: false, error: true};
    }

    try {
        await prisma.user.update({
            where: {
                id: currentUserId,
            },
            data: validFields.data
        })
        
        revalidatePath("/profile/" + validFields.data.name);
        return {success: true, error: false};

    } catch (error) {
        console.log(error)
        return {success: false, error: true};
    }

}


export const switchLike = async (postId: number) => {
    const {userId: currentUserId} = await auth();
    if (!currentUserId) {
        throw new Error("User not authenticated");
    }
    try {
        const exisitingLike = await prisma.like.findFirst({
            where: {
                userId: currentUserId,
                postId: postId,
            }
        })

        if(exisitingLike) {
            await prisma.like.delete({
                where: {id: exisitingLike.id}
            })
        } else {
            await prisma.like.create({
                data: {
                    userId: currentUserId,
                    postId: postId, 
                }
            })
        }
    } catch (error) {
        console.log(error)
    }
}


export const addComment = async (postId: number, desc: string) => {
    const {userId} = await auth();
    if (!userId) {
        throw new Error("User not authenticated");
    }

    try {

      const createdComment = await prisma.comment.create({
        data: {
            postId,
            userId,
            desc
        }, include: {
            user: true
        }
    })

    return createdComment

    } catch (error) {
        console.log(error)
    }
}

export const addPost = async (formData: FormData, img: string) => {
    const {userId} = await auth();
    if (!userId) {
        throw new Error("User not authenticated");
    }

    const desc = formData.get("desc") as string;

    const Desc = z.string().min(1).max(255)

    const validDesc = Desc.safeParse(desc);

    if( !validDesc.success) {
        console.log(validDesc.error.flatten().fieldErrors);
        throw new Error("Invalid description");
    }


    try {
        await prisma.post.create({
            data: {
               userId,
               desc: validDesc.data,
               img
            }
        })

        revalidatePath("/");

    } catch (error) {
        console.log(error);
        throw new Error("Failed to add post");
    }

}


export const addStory = async (img: string) => {
    const { userId } = await auth();

    if (!userId) return null;

    try {
        const existingStory = await prisma.story.findFirst({
            where: {
                userId,
            }
        })
        if (existingStory) {
            await prisma.story.delete({
                where: {
                    id: existingStory.id
                }
            })
        }
        const story = await prisma.story.create({
            data: {
                userId,
                img,
                expiredAt: new Date(Date.now() + 24*60*60*1000)
            },
            include: {
                user: true
            }
        })

        return story;

    } catch (error) {
        console.log(error)
        throw new Error("something went wrong!..")
    }
}


export const deletePost = async (postId: number) => {
    const {userId} = await auth();
    if (!userId) return null;

    try {
        await prisma.post.delete({
            where: {
                id: postId,
                userId,
            }
        })
    } catch (error) {
        console.log(error)
    }
}