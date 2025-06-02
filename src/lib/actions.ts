"use server"

import { auth } from "@clerk/nextjs/server"
import prisma from "./client";

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