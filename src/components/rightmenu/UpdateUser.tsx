'use client'
import { updateProfile } from "@/lib/actions";
import { User } from "@prisma/client"
import { CldUploadWidget } from "next-cloudinary";
import Image from "next/image";
import { useActionState, useState } from "react";
import UpdateButton from "./UpdateButton";

type CloudinaryResult = {
  secure_url: string;
  public_id: string;
  format?: string;
  [key: string]: any;
};

const UpdateUser = ({user}: {user: User}) => {
    const [open, setOpen] = useState(false);
    const [cover, setCover] = useState<CloudinaryResult | null>(null)

    const handleClose = () => {
        setOpen(false);
    }

    const [state, formAction] = useActionState(updateProfile, {success: false, error: false})

  return (
    <div className="">
        <span className="text-blue-500 text-xs cursor-pointer" onClick={() => setOpen(true)}>Update</span>
        {open && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-x-hidden">
            <form action={(formData) => formAction({formData, cover: cover?.secure_url || ""})} className="p-6 bg-white rounded-lg shadow-md flex flex-col gap-4 w-[90%] md:w-1/2 xl:w-1/3 relative">
                <h1 className="">Update Profile</h1>
                <div className="mt-4 text-lg text-gray-500">Use the Navbar profile to change the avater or username</div>
                
                <CldUploadWidget
                    uploadPreset="gather"
                    onSuccess={(result) => {
                        if (result && typeof result.info === "object" && result.info !== null && "secure_url" in result.info) {
                            setCover(result.info as CloudinaryResult);
                        }
                    }}
                >
                        {({ open }) => {
                            return (
                            <div className="flex flex-col gap-4 my-4" onClick={() => open()}>
                                <label htmlFor="">Cover Picture</label>
                                <div className="flex items-center gap-2 cursor-pointer">
                                    <Image src={user.cover || "/noCover.png"} alt="" width={48} height={32}  className="w-12 h-8 rounded-md object-cover"/>
                                    <span className="text-xs underline text-gray-600">Change</span>
                                </div>
                            </div>
                            );
                        }}
                </CldUploadWidget>
                
                
                {/* WRAPPER */}
                <div className="flex flex-wrap justify-between gap-2 xl:gap-4">
                    <div className="flex flex-col gap-4">
                        <label htmlFor="" className="text-xs text-gray-500">First Name</label>
                        <input type="text" name="name" placeholder={user.name || "john"} className="ring-1 ring-gray-300 p-[13px] rounded-md text-sm"/>
                    </div>

                    <div className="flex flex-col gap-4">
                        <label htmlFor="" className="text-xs text-gray-500">SurName</label>
                        <input type="text" name="surname" placeholder={user.surname || "Doe"} className="ring-1 ring-gray-300 p-[13px] rounded-md text-sm"/>
                    </div>
                
                    <div className="flex flex-col gap-4">
                        <label htmlFor="" className="text-xs text-gray-500">Description</label>
                        <input type="text" name="description" placeholder={user.description || "Fitness advocate"} className="ring-1 ring-gray-300 p-[13px] rounded-md text-sm"/>
                    </div>
                
                    <div className="flex flex-col gap-4">
                        <label htmlFor="" className="text-xs text-gray-500">City</label>
                        <input type="text" name="city" placeholder={user.city || "New york"} className="ring-1 ring-gray-300 p-[13px] rounded-md text-sm"/>
                    </div>
                
                    <div className="flex flex-col gap-4">
                        <label htmlFor="" className="text-xs text-gray-500">School</label>
                        <input type="text" name="school" placeholder={user.school || "Harvard"} className="ring-1 ring-gray-300 p-[13px] rounded-md text-sm"/>
                    </div>
                
                    <div className="flex flex-col gap-4">
                        <label htmlFor="" className="text-xs text-gray-500">Work</label>
                        <input type="text" name="work" placeholder={user.work || "Apple"} className="ring-1 ring-gray-300 p-[13px] rounded-md text-sm"/>
                    </div>
                
                    <div className="flex flex-col gap-4">
                        <label htmlFor="" className="text-xs text-gray-500">Website</label>
                        <input type="text" name="website" placeholder={user.website || "example.com"} className="ring-1 ring-gray-300 p-[13px] rounded-md text-sm"/>
                    </div>
                </div>
                <UpdateButton />
                {state.success && <span className="text-green-500 text-sm">Profile updated successfully!</span>}
                {state.error && <span className="text-red-500 text-sm">Something went wrong, please try again.</span>}
                <div className="absolute text-xl right-2 top-3 cursor-pointer" onClick={handleClose}>X</div>
            </form>
        </div>
        )}
    </div>
  )
}

export default UpdateUser