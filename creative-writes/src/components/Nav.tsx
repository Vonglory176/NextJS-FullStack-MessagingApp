"use client";

import Link from "next/link";
import {auth} from "../utils/firebase"
import { useAuthState } from "react-firebase-hooks/auth";
// import { signOut } from "firebase/auth";

export default function Nav() {
    const [user, loading] = useAuthState(auth)
    // console.log(user)

    return (
      <nav className="flex justify-between items-center py-10">
          <Link href="/">
            <button className="text-lg font-medium">Creative Minds</button>
          </Link>

          <ul className="flex items-center gap-10">
            {!user &&
              <li>
                <Link href="/auth/login" className="py-2 px-4 text-sm bg-cyan-500 text-white font-medium ml-8 rounded-lg">Login</Link>
              </li>
              // :
              // <li>
              //   <button onClick={() => signOut(auth)} className="py-2 px-4 text-sm bg-cyan-500 text-white font-medium ml-8 rounded-lg">Logout</button>
              // </li>
            }

            {user &&
              <li className="flex items-center gap-6">
                <Link href="/post">
                  <button className="font-medium bg-cyan-500 text-white py-2 px-4 rounded-md text-sm">Post</button>
                </Link>
              </li>
            }

            {user &&
              <li>
                <Link href="/dashboard">
                  <img src={user?.photoURL || ""} alt="user" className="w-12 h-12 rounded-full cursor-pointer" />
                </Link>
              </li>
            }

          </ul>
      </nav>
    )
}