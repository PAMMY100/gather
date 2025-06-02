'use client'
import { User } from "@prisma/client"
import Image from "next/image";
import { useState } from "react";

const UpdateUser = ({user}: {user: User}) => {
    const [open, setOpen] = useState(false);

    const handleClose = () => {
        setOpen(false);
    }

  return (
    <div className="">
        <span className="text-blue-500 text-xs cursor-pointer" onClick={() => setOpen(true)}>Update</span>
        {open && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-x-hidden">
            <form action="" className="p-6 bg-white rounded-lg shadow-md flex flex-col gap-4 w-[90%] md:w-1/2 xl:w-1/3 relative">
                <h1 className="">Update Profile</h1>
                <div className="mt-4 text-lg text-gray-500">Use the Navbar profile to change the avater or username</div>
                <div className="flex flex-col gap-4 my-4">
                    <label htmlFor="">Cover Picture</label>
                    <div className="flex items-center gap-2 cursor-pointer">
                        <Image src={user.cover || "/noCover.png"} alt="" width={48} height={32}  className="w-12 h-8 rounded-md object-cover"/>
                        <span className="text-xs underline text-gray-600">Change</span>
                    </div>
                </div>
                <div className="flex flex-wrap justify-between gap-2 xl:gap-4">
                    <div className="flex flex-col gap-4">
                        <label htmlFor="" className="text-xs text-gray-500">First Name</label>
                        <input type="text" placeholder={user.name || "john"}/>
                    </div>
                </div>
                <div className="flex flex-wrap justify-between gap-2 xl:gap-4">
                    <div className="flex flex-col gap-4">
                        <label htmlFor="" className="text-xs text-gray-500">SurName</label>
                        <input type="text" placeholder={user.surname || "Doe"}/>
                    </div>
                </div>
                <div className="flex flex-wrap justify-between gap-2 xl:gap-4">
                    <div className="flex flex-col gap-4">
                        <label htmlFor="" className="text-xs text-gray-500">Description</label>
                        <input type="text" placeholder={user.description || "Fitness advocate"}/>
                    </div>
                </div>
                <div className="flex flex-wrap justify-between gap-2 xl:gap-4">
                    <div className="flex flex-col gap-4">
                        <label htmlFor="" className="text-xs text-gray-500">City</label>
                        <input type="text" placeholder={user.city || "New york"}/>
                    </div>
                </div>
                <div className="flex flex-wrap justify-between gap-2 xl:gap-4">
                    <div className="flex flex-col gap-4">
                        <label htmlFor="" className="text-xs text-gray-500">School</label>
                        <input type="text" placeholder={user.school || "Harvard"}/>
                    </div>
                </div>
                <div className="flex flex-wrap justify-between gap-2 xl:gap-4">
                    <div className="flex flex-col gap-4">
                        <label htmlFor="" className="text-xs text-gray-500">Work</label>
                        <input type="text" placeholder={user.work || "Apple"}/>
                    </div>
                </div>
                <div className="flex flex-wrap justify-between gap-2 xl:gap-4">
                    <div className="flex flex-col gap-4">
                        <label htmlFor="" className="text-xs text-gray-500">Website</label>
                        <input type="text" placeholder={user.website || "example.com"}/>
                    </div>
                </div>
                <button className="bg-blue-500 p-2 mt-2 rounded-md text-white">Update</button>
                <div className="absolute text-xl right-2 top-3 cursor-pointer" onClick={handleClose}>X</div>
            </form>
        </div>
        )}
    </div>
  )
}

export default UpdateUser