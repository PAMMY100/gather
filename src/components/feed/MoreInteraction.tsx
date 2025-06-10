'use client';

import Image from "next/image";
import { useState } from "react";

const MoreInteraction = ({postId}: {postId: number}) => {
    const [open, setOpen] = useState(false);

  return (
    <div className="">
        <Image src="/more.png" alt="" width={16} height={40} onClick={() => setOpen(prev => !prev)} />
        {open && (
            <div className="absolute top-4 right-0 bg-white p-4 w-32 rounded-lg flex flex-col gap-2 text-xs shadow-md">
                <span className="cursor-pointer">View</span>
                <span className="cursor-pointer">Re-post</span>
                <form action={}>
                    <button className="text-red-500">Delete</button>
                </form>
            </div>
            )}
    </div>
  )
}

export default MoreInteraction