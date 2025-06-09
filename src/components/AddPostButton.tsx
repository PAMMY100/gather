'use client'

import { useFormStatus } from "react-dom"

const AddPostButton = () => {
    const {pending} = useFormStatus()

  return (
    <button className="bg-blue-500 p-2 mt-2 rounded-md text-white disabled:bg-blue-300 disabled:cursor-not-allowed" disabled={pending}>
        {pending ? (
            <div className="animate-spin inline-block size-6 border-3 border-current border-t-transparent text-blue-600 rounded-full" role="status" aria-label="loading">
                <span className="sr-only">Sending...</span>
            </div>
) : "Send"}
    </button>
  )
}

export default AddPostButton