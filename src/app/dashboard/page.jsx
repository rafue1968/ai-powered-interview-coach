"use client";

import { useRouter } from "next/navigation";
import NavigationButton from "../../components/NavigationButton"
import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import Loading from "../../components/Loading"
import { auth, firestore } from "../../lib/firebaseClient";
import { getDoc, doc } from "firebase/firestore";
import LogoutButton from "../../components/LogoutButton";
// import DeleteAccountButton from "../../components/DeleteAccountButton"


export default function Page(){
    const router = useRouter();
    const [authorized, setAuthorized] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const checkAccessAndFetch = async () => {
        onAuthStateChanged(auth, async (user) => {
          if (user) {
            const snap = await getDoc(doc(firestore, "users", user.uid));
            const role = snap.exists() ? snap.data().role : "user";
  
            if (role === "user") {
              setAuthorized(true);
            } else {
              alert("Sorry. You cannot this page. You must login first.");
              router.push("/");
            }
          } else {
            router.push("/login");
          }
          setLoading(false);
        });
      };
  
      checkAccessAndFetch();
    }, []);
    
    if (loading) return <Loading />;
    if (!authorized) return null;

    return (
        <div>
            <NavigationButton routeText="ai-interview-coach" buttonText="Start Interview Session" />
            <NavigationButton routeText="login" buttonText="View History" />
            <LogoutButton />
            {/* <DeleteAccountButton /> */}
        </div>
    )
}