import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import prisma from "@/lib/client";

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error("Please add WEBHOOK_SECRET from Clerk Dashboard to .env");
  }

  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp"); // ✅ fixed typo here
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_signature || !svix_timestamp) {
    return new Response("Error occurred -- missing Svix headers", {
      status: 400,
    });
  }

  const payload = await req.json();
  const body = JSON.stringify(payload);

  const wh = new Webhook(WEBHOOK_SECRET);
  let evt: WebhookEvent;

  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook", err);
    return new Response("Webhook verification failed", {
      status: 400,
    });
  }

  const eventType = evt.type;

  if (eventType === "user.created") {
    try {
      await prisma.user.create({
        data: {
          id: payload.data.id,
          username: payload.data.username,
          avater: payload.data.image_url || "/noAvatar.png",
          cover: "/noCover.png",
        },
      });
      return new Response("User created successfully", { status: 201 });
    } catch (error) {
      console.error("Failed to create user:", error);
      return new Response("Failed to create the user", { status: 500 });
    }
  }

  if (eventType === "user.updated") {
    try {
      await prisma.user.update({
        where: { id: payload.data.id },
        data: {
          username: payload.data.username,
          avater: payload.data.image_url || "/noAvatar.png",
        },
      });
      return new Response("User updated successfully!", { status: 200 });
    } catch (error) {
      console.error("Failed to update user:", error);
      return new Response("Failed to update the user", { status: 500 });
    }
  }

  return new Response("Event received", { status: 200 });
}
