"use client";

import React, { useEffect, useState } from "react"
import { auth, db } from "../../utils/firebase"
import { useAuthState } from "react-firebase-hooks/auth"
import { useRouter } from "next/navigation"
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { toast } from "react-toastify";
import { useSearchParams } from "react-router-dom";

const Post = () => {
    // User State
    const [user, loading] = useAuthState(auth)
    const route = useRouter()
    const [searchParams] = useSearchParams()
    const routeData = {
        id: searchParams.get("id"),
        description: searchParams.get("description"),
    }

    // Form State
    const [post, setPost] = useState({
        description: "",
        // title: "",
        // content: "",
    })

    // Change Description
    const maxCharacters = 300
    const changeDescription = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        let newDescription = e.target.value
        // if (newDescription.length > maxCharacters) newDescription = newDescription.slice(0, maxCharacters)
        setPost({ ...post, description: newDescription })
    }

    // Submit Post
    const submitPost = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const text = post.description

        // Run checks for description
        if(text.length < 1) return toast.error("Please enter a description", {
            // position: "top-center",
            // autoClose: 1000,
            // hideProgressBar: false,
            // closeOnClick: true,
            // pauseOnHover: true,
            // draggable: true,
            // progress: undefined,
        })

        if(text.length > maxCharacters) return toast.error("Description is too long", {
            // position: "top-center",
            // autoClose: 1000,
            // hideProgressBar: false,
            // closeOnClick: true,
            // pauseOnHover: true,
            // draggable: true,
            // progress: undefined,
        })

        const collectionRef = collection(db, "posts")
        const docRef = await addDoc(collectionRef, {
            ...post,
            timeStamp: serverTimestamp(),
            user: user?.uid,
            avatar: user?.photoURL,
            username: user?.displayName,
        })

        setPost({ description: "" })
        return route.push("/")
    }

    // Check User
    const checkUser = async () => {
        if(loading) return
        if(!user) return route.push("/auth/login")
        if(routeData.id) {
            setPost({ description: routeData.description || "" })
        }
    }

    useEffect(() => {
        checkUser()
    }, [user, loading])

    return (
        <div className="my-20 p-12 shadow-lg rounded-lg max-w-md mx-auto">
            <form onSubmit={submitPost}>
                <h1 className="text-xl font-bold">Create a new post</h1>
                <div className="py-2">
                    <label htmlFor="description" className="text-lg font-medium py-2">Description</label>
                    <textarea 
                    name="description" 
                    id="description" 
                    value={post.description}
                    onChange={changeDescription}
                    className="bg-gray-800 h-48 w-full text-white rounded-lg p-2 text-small font-medium"
                    ></textarea>
                    <p className={`text-cyan-600 font-medium text-sm ${post.description.length >= maxCharacters ? "text-red-600" : ""}`}>{post.description.length}/{maxCharacters}</p>
                </div>
                <button type="submit" className="w-full bg-cyan-600 text-white font-medium p-2 my-2 rounded-lg text-sm">Create</button>
            </form>
        </div>
    )
}

export default Post