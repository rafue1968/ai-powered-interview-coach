"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import UploadResume from "../../../../components/UploadResume";
import JobRoleInput from "../../../../components/JobRoleInput";
import { auth, firestore } from "../../../../lib/firebaseClient";
import Loading from "../../../../components/Loading";

export default function Page() {
  const router = useRouter();
  const { id } = useParams();
  const [user, setUser] = useState("");
  const [session, setSession] = useState(null);
  

  useEffect(() => {
    const unsub = auth.onAuthStateChanged((user) => {
      if (!user) router.push("/login");
      else setUser(user);
    });
    return () => unsub();
  }, [router]);


  useEffect(() => {

    if (!user) return;

    const fetchSession = async () => {
      const snap = await getDoc(doc(firestore, "users", auth.currentUser.uid, "sessions", id));
      if (snap.exists()) setSession(snap.data());
      else router.push("/interview-sessions");
    };
    fetchSession();
  }, [id, user, router]);

  if (!session) return <Loading text="Loading session" />;

  const onComplete = async (updatedFields) => {
    await updateDoc(doc(firestore, "users", user.uid, "sessions", id), {
      ...updatedFields,
      step: "ready"
    });
    router.push(`/interview-sessions/${id}/chat`);
  };

  return session.interviewType === "resume" ? (
    <UploadResume
      onComplete={(summary) => onComplete({ resumeSummary: summary })}
      skipIfExists={session.resumeSummary}
    />
  ) : (
    <JobRoleInput
      onComplete={(jobRole) => onComplete({ jobRole })}
      skipIfExists={session.jobRole}
    />
  );
}
