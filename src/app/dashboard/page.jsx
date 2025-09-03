"use client";

import { useRouter } from "next/navigation";
import NavigationButton from "../../components/NavigationButton"
import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import Loading from "../../components/Loading"
import { auth, firestore } from "../../lib/firebaseClient";
import { getDoc, doc } from "firebase/firestore";
import ShowCurrentUserLogoutButton from "../../components/ShowCurrentUserLogoutButton";
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
          } else {
            router.push("/login");
          }
          setLoading(false);
        });
      };
  
      checkAccessAndFetch();
    }, []);
    
    if (loading) return <Loading />;

    return (
        <div className="">
            <NavigationButton routeText="ai-interview-coach" buttonText="Start Interview Session" />
            <NavigationButton routeText="login" buttonText="View History" />
            {/* <ShowCurrentUserLogoutButton /> */}
            {/* <DeleteAccountButton /> */}
        </div>
    )
}