"use client";

import { useEffect, useRef, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc, collection, onSnapshot, serverTimestamp, updateDoc } from "firebase/firestore";
import { firestore, auth } from "../../lib/firebaseClient";
import { useRouter } from "next/navigation";
import Loading from "../../components/Loading";
import SessionsList from "../../components/SessionsList";
import InterviewChat from "../../components/InterviewChat";
import JobRoleInput from "../../components/JobRoleInput";
import UploadResume from "../../components/UploadResume";
import { v4 as uuidv4 } from "uuid";

export default function Page() {
  const router = useRouter();

  const [sessions, setSessions] = useState([]);
  const [sessionsRef, setSessionsRef] = useState(null);
  const [selectedSessionID, setSelectedSessionID] = useState("");
  const selectedSessionRef = useRef(selectedSessionID);

  useEffect(() => {
    selectedSessionRef.current = selectedSessionID;
  }, [selectedSessionID]);

  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState(null);
  const [resumeText, setResumeText] = useState("");
  const [jobRole, setJobRole] = useState("");
  const [user, setUser] = useState(null);
  const [currentStep, setCurrentStep] = useState("input");
  const [hasAutoSelected, setHasAutoSelected] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          setUser(user);
        } else {
          router.push("/login");
        }
        setLoading(false);
      });
    };
    checkAuth();
  }, [router]);

  useEffect(() => {
    if (!user) return;
    if (hasAutoSelected) return;

    const ref = collection(firestore, "users", user.uid, "sessions");
    setSessionsRef(ref);

    const unsubscribe = onSnapshot(
      ref, 
      (snapshot) => {
      const list = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setSessions(list);

      const selId = selectedSessionRef.current;

      if (selId) {
        const currentSession = list.find((s) => s.sessionId === selId);
        if (currentSession){
          // setSelectedSessionID(currentSession.sessionId);
          setMode(currentSession.interviewType || null);
          setJobRole(currentSession.jobRole || "");
          setResumeText(currentSession.resumeSummary || "");
          setCurrentStep(currentSession.step || "input");
          // setHasAutoSelected(true);
          return;
        } else {
          setSelectedSessionID("");
          selectedSessionRef.current = "";
        }
      }

      // Auto-select first session if none selected
      if (!selectedSessionRef.current && !hasAutoSelected && list.length > 0) {
        const prefer = list.find((s) => s.step && s.step !== "input") || list[0];
        if (prefer){
            setSelectedSessionID(prefer.sessionId);
            selectedSessionRef.current = prefer.sessionId;
            setMode(prefer.interviewType || null);
            setJobRole(prefer.jobRole || "");
            setResumeText(prefer.resumeSummary || "");
            setCurrentStep(prefer.step || "input");
            setHasAutoSelected(true);

            if (
                prefer.step === "input" &&
                ((prefer.interviewType === "resume" && prefer.resumeSummary) ||
                (prefer.interviewType === "jobrole" && prefer.jobRole))
            ) {
              const sessionDocRef = doc(ref, prefer.sessionId);
              updateDoc(sessionDocRef, {step: "ready"}).catch(() => {});
              setCurrentStep("ready");
            }
        }
      }
    },
    (err) => {
      console.error("Sessions on onSnapshot error:", err.message);
    }
  
  );

    return () => unsubscribe();
  }, [user, hasAutoSelected]);

  useEffect(() => {
    if (!ready || !selectedSessionID || !sessionsRef) return;
    const sessionDocRef = doc(sessionsRef, selectedSessionID);
    updateDoc(sessionDocRef, { step: "chat" }).catch(()=>{});
  }, [ready, selectedSessionID, sessionsRef]);

  const createSession = async (name, type) => {
    if (!sessionsRef) return;

    const sessionId = uuidv4();
    const data = {
      sessionId,
      name,
      interviewType: type,
      step: "input",
      createdAt: serverTimestamp(),
    };
    const sessionDocRef = doc(sessionsRef, sessionId);
    await setDoc(sessionDocRef, data);

    setSelectedSessionID(sessionId);
    setMode(type);
    setJobRole("");
    setResumeText("");
    setCurrentStep("input");
    setReady(false);
    setHasAutoSelected(true);
  };

  const selectSessionID = async (sessionId) => {
    setSelectedSessionID(sessionId);
    selectedSessionRef.current = sessionId;
    setHasAutoSelected(true);

    if (!sessionsRef) return;

    try {  
      const snap = await getDoc(doc(sessionsRef, sessionId));
      if (snap.exists()) {
        const data = snap.data();
        setMode(data.interviewType || null);
        setJobRole(data.jobRole || "");
        setResumeText(data.resumeSummary || "");
        setCurrentStep(data.step || "input");
      } else {
        setMode(null);
        setJobRole("");
        setResumeText("");
        setCurrentStep("input");
      }
    } catch (err) {
      console.error("selectSessionId error:", err);
      setCurrentStep("input");
    }
  };

  const redirectInterface = () => {
    setSelectedSessionID("");
    setMode(null);
    setJobRole("");
    setResumeText("");
    setCurrentStep("input");
    setReady(false);
    // setHasAutoSelected(false);
  };

  if (loading) return <Loading />;

  let content;
  if (!selectedSessionID) {
    content = (
      <SessionsList
        createSession={createSession}
        sessions={sessions}
        selectSessionID={selectSessionID}
      />
    );
  } else if (currentStep === "input") {
    const sessionDocRef = doc(sessionsRef, selectedSessionID);
    content =
      mode === "resume" ? (
        <UploadResume
          setResumeText={setResumeText}
          onComplete={async () => {
            await updateDoc(sessionDocRef, { step: "ready" });
            setCurrentStep("ready");
          }}
          sessionsRef={sessionsRef}
          selectedSessionID={selectedSessionID}
          skipIfExists={resumeText}
        />
      ) : (
        <JobRoleInput
          setJobRole={setJobRole}
          onComplete={async () => {
            await updateDoc(sessionDocRef, { step: "ready" });
            setCurrentStep("ready");
          }}
          sessionsRef={sessionsRef}
          selectedSessionID={selectedSessionID}
          skipIfExists={jobRole}
        />
      );
  } else if (currentStep === "ready" || currentStep === "chat") {
    content = (
      <>
        <h2 className="currentModeBox">
          Interview Coach: {mode === "resume" ? "Resume" : "Job Role"} Mode
        </h2>
        <InterviewChat
          user={user}
          sessionId={selectedSessionID}
          jobRole={jobRole}
          resumeText={resumeText}
        />
      </>
    );
  } else {
    content = <p>Invalid state. Please refresh.</p>;
  }

  return (
    <div>
      {content}
      <div style={{ display: "flex", justifyContent: "center" }}>
        <button
          onClick={redirectInterface}
          style={{
            marginTop: "30px",
            width: "200px",
            fontSize: "15px",
            fontWeight: "600",
          }}
        >
          Return to Interview Sessions Interface
        </button>
      </div>
    </div>
  );
}
