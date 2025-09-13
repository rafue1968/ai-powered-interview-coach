"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { firestore, auth } from "../../../../lib/firebaseClient";
import InterviewChat from "../../../../components/InterviewChat";
import Loading from "../../../../components/Loading";

export default function Page() {
  const { id } = useParams();
  const router = useRouter();
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);

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
      const snap = await getDoc(doc(firestore, "users", user.uid, "sessions", id));
      if (snap.exists()) setSession(snap.data());
      else router.push("/interview-sessions");
    };
    fetchSession();
  }, [id, user, router]);


  const redirectInterface = () => {
    router.push("/interview-sessions")
  }

  if (!session || !user) return <Loading text="Loading chat" />;

  return (
    <>
      <h2 className="currentModeBox">Interview Coach: {session.interviewType === "resume" ? "Resume" : "Job Role"} Mode</h2>
      <InterviewChat
        user={user}
        sessionId={id}
        jobRole={session.jobRole}
        resumeText={session.resumeSummary}
      />

      <button
          onClick={redirectInterface}
          className="redirectInterfaceButton"
        >
          Return to Interview Sessions page
        </button>
    </>
  );
}
