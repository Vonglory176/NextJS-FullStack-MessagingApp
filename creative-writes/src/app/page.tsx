"use client"

// This is used to define the content of a specific page.
import React, { useEffect, useState } from "react"
import Message from "../components/Message"
import { db } from "../utils/firebase"
import { collection, onSnapshot, orderBy, query } from "firebase/firestore"
// import RootLayout from "./layout"

export default function Home() { // {Component, pageProps}: {Component: ComponentType, pageProps: any}
  const [allPosts, setAllPosts] = useState<any[]>([])

  const getPosts = async () => {
    const collectionRef = collection(db, "posts")
    const q = query(collectionRef, orderBy("timeStamp", "desc"))

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      // console.log(querySnapshot.docs)
      setAllPosts(querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      })))
    })
    
    return unsubscribe
  }

  useEffect(() => {
    getPosts()
  }, [])

  return (
    <div>
      <h1>Welcome to the Home Page</h1>
      <p>This is a sample content inside the RootLayout.</p>

      <div className="my-12 text-lg font-medium">
        <h2>See what other people are saying</h2>
        {allPosts.map((post) => (
          <Message key={post.id} {...post} />
        ))}
      </div>
    </div>

    // <RootLayout>
    //   <h1>Home</h1>
    //   {/* <Component {...pageProps} /> */}
    // </RootLayout>
  )
}