"use client";

import { signOut } from "firebase/auth";
import { auth } from "../lib/firebaseClient.js";
import { useRouter } from "next/navigation";

export default function LogoutButton(){
    const router = useRouter();
    const currentuser = auth.currentUser;

    const handleLogout = async () => {
        try {
            await signOut(auth);
            router.push("/");
        } catch (err) {
            console.log("Logout failed: ", err);
        }
    };


    return (
        <div className="showCurrentUserLogout">
            <strong>{currentuser.email}</strong>
            <button onClick={handleLogout} className="showCurrentUserLogoutButton">
                Logout
            </button>
        </div>

        
    )
}