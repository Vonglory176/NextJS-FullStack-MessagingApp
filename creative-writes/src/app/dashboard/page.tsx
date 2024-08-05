"use client";

import React, { useEffect, useState } from 'react'
import { auth, db } from "../../utils/firebase"
import { signOut } from "firebase/auth"
import { useAuthState } from "react-firebase-hooks/auth"
import { useRouter } from "next/navigation"
import { collection, deleteDoc, doc, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import Message from '../../components/Message';
import { BsTrash2Fill } from "react-icons/bs"
import { AiFillEdit } from "react-icons/ai"
import Link from "next/link"




const Dashboard = () => {
    const [allPosts, setAllPosts] = useState<any[]>([])
    const [user, loading] = useAuthState(auth)
    const route = useRouter()

    // console.log(user)

    
    // Check if user is logged-in
    const getData = async () => {
        if(loading) return
        else if(!user) return route.push("/auth/login")
        
        console.log(user)
        const collectionRef = collection(db, "posts")
        const q = query(collectionRef, where("user", "==", user?.uid), orderBy("timeStamp", "desc"))
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            console.log(querySnapshot.docs)
            setAllPosts(querySnapshot.docs.map((doc) => ({
              ...doc.data(),
              id: doc.id,
            })))
        })
        
        return unsubscribe
    }

    // Delete Post
    const deletePost = async (id: string) => {
        const docRef = doc(db, "posts", id)
        await deleteDoc(docRef)

        getData()
    }
        
    // Get user data
    useEffect(() => {
        getData()
    }, [user, loading])


    return (
        <div>
            <h1>Your posts</h1>
            <div>
                {allPosts.map((post) => (
                    <Message key={post.id} {...post}>
                        <div className='flex gap-4'>
                            <button onClick={() => deletePost(post.id)} className='text-pink-600 flex items-center justify-center gap-2 py-2 text-sm'><BsTrash2Fill className='text-2xl'/> Delete</button>
                            <Link href={{ pathname: "/post", query: {...post}}}>
                                <button className='text-pink-600 flex items-center justify-center gap-2 py-2 text-sm'><AiFillEdit className='text-2xl'/> Edit</button>
                            </Link>
                        </div>
                    </Message>
                ))}

            </div>
            <button className='font-medium text-white bg-gray-800 px-4 py-2 my-6 rounded-md' onClick={() => signOut(auth)}>Sign out</button>
        </div>
    )
}

export default Dashboard