"use client";

import Dictaphone from "../../components/Dictaphone";
import InterviewCoach from "../../components/InterviewCoach";
import textGemini from "../../components/testGemini"
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import  "../../lib/firebaseClient";
import { useRouter } from "next/navigation";
import Loading from "../../components/Loading";
import StartInterviewInput from "../../components/StartInterviewInput";
import InterviewChat from "../../components/InterviewChat";
import { firestore, auth } from "../../lib/firebaseClient";
import JobRoleInput from "../../components/JobRoleInput";


export default function Page(){
    const router = useRouter();

    const [loading, setLoading] = useState(true);
    const [mode, setMode] = useState(null);
    const [resumeText, setResumeText] = useState("");
    const [jobRole, setJobRole] = useState("");
    const [user, setUser] = useState("");
    const [ready, setReady] = useState(false);

    useEffect(() => {
      const checkAuth = async () => {
        onAuthStateChanged(auth, async (user) => {
          if (user) {
            // const snap = await getDoc(doc(firestore, "users", user.uid));
            setUser(user);
          } else {
            router.push("/login");
          }
          setLoading(false);
        });
      };
  
      checkAuth();
    }, []);
    
    if (loading) return <Loading />;
    
    return (
        <div>
        {!mode ? (
            <StartInterviewInput setMode={setMode} />
        ) : !ready ? (
            mode === "resume" ? (
            <UploadResume setResumeText={setResumeText} onComplete={() => setReady(true)} />
            ) : (
            <JobRoleInput setJobRole={setJobRole} onComplete={() => setReady(true)} />
            )
        ) : (
            <>
            <h2>Interview Coach: {mode === "resume" ? "Resume" : "Job Role"} Mode</h2>
            <InterviewChat user={user.uid} jobRole={jobRole} resumeText={resumeText} />
            </>
        )}
        </div>
    );
}