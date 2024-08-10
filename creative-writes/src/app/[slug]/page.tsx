// The square brackets in the folder name are used to create a dynamic route
"use client"

import Message from "../../components/Message"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { auth, db } from "../../utils/firebase"
import { toast } from "react-toastify"
import { arrayUnion, doc, getDoc, onSnapshot, Timestamp, updateDoc } from "firebase/firestore"

type MessageType = {
    message: string;
    avatar: string;
    username: string;
    timeStamp: Timestamp;
};

export default function Details() {
    const route = useRouter()
    const searchParams = useSearchParams()
    const routeData = {
        id: searchParams?.get("id") || "",
        description: searchParams?.get("description") || "",
        avatar: '', //searchParams?.get("avatar"),
        username: '', // searchParams?.get("username"),
        children: '',
    }
    const [message, setMessage] = useState<string>('')
    const [allMessages, setAllMessages] = useState<MessageType[]>([])

    // Submit a message
    const submitMessage = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        // if(!routeData.id) return
        if(!auth.currentUser) return route.push("/login")
        if(!message) return toast.error("Message cannot be empty")

        console.log(routeData)
        console.log(searchParams)
        const docRef = doc(db, 'posts', routeData.id)
        await updateDoc(docRef, {
            comments: arrayUnion({
                message,
                avatar: auth.currentUser.photoURL,
                username: auth.currentUser.displayName,
                timeStamp: Timestamp.now()
            })
        })

        setMessage('')
        toast.success("Comment submitted")
    }

    // Get Comments
    const getComments = async () => {
        const docRef = doc(db, 'posts', routeData.id)
        const unsubscribe = onSnapshot(docRef, (docSnap: any) => {
            setAllMessages(docSnap?.data()?.comments || [])
        })
        return unsubscribe
    }

    useEffect(() => {
        if(!routeData.id) return
        getComments()
    }, [routeData.id])

    return (
        <div>
            <Message {...routeData}></Message>
            <div className="my-4">
                <form onSubmit={submitMessage} className="flex">
                    <input 
                        onChange={(e) => setMessage(e.target.value)} 
                        type="text" 
                        value={message} 
                        placeholder="Send a message" 
                        className="bg-gray-800 w-full p-2 text-white text-sm"
                    />
                    <button type="submit" className="bg-cyan-500 text-white py-2 px-4">Submit</button>
                </form>
                <div className="py-6">
                    <h2 className="font-bold">Comments</h2>
                    {allMessages.map((message) => (
                        <div className="bg-white p-4 my-4 border-2" key={message.timeStamp.toDate().toISOString()}>
                            <div className="flex items-center gap-2 mb-4">
                                <img className="rounded-full overflow-hidden w-10 h-10" src={message.avatar} alt="" />
                                <h2>{message.username}</h2>
                            </div>
                            <h2>{message.message}</h2>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}