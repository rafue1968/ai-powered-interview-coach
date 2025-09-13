"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { auth, firestore } from "../../../lib/firebaseClient";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import Loading from "../../../components/Loading";

export default function Page() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const name = searchParams.get("name");
  const type = searchParams.get("type");

  useEffect(() => {

    const createSession = async () => {
        if (!auth.currentUser || !name || !type) return;
        
        const id = crypto.randomUUID();
        await setDoc(doc(firestore, "users", auth.currentUser.uid, "sessions", id), {
                name,
                interviewType: type,
                step: "input",
                createdAt: serverTimestamp(),
        });

            router.replace(`/interview-sessions/${id}/input`);
        };
        createSession();
    }, [name, type, router])

    return <Loading text="Creating session" />
}
