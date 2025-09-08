"use client";

// import Dictaphone from "../../components/Dictaphone";
// import InterviewCoach from "../../components/InterviewCoach";
// import textGemini from "../../components/testGemini"
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc, collection, onSnapshot, serverTimestamp, updateDoc } from "firebase/firestore";
import  "../../lib/firebaseClient";
import { useRouter } from "next/navigation";
import Loading from "../../components/Loading";
// import StartInterviewInput from "../../components/StartInterviewInput";
import SessionsList from "../../components/SessionsList"
import InterviewChat from "../../components/InterviewChat";
import { firestore, auth } from "../../lib/firebaseClient";
import JobRoleInput from "../../components/JobRoleInput";
import UploadResume from "../../components/UploadResume"
import { v4  as uuidv4 } from "uuid"
import NavigationButton from "../../components/NavigationButton";
import ShowCurrentUserLogoutButton from "../../components/ShowCurrentUserLogoutButton"


export default function Page(){
    const router = useRouter();

    const [sessions, setSessions] = useState([]);
    const [sessionsRef, setSessionRef] = useState(null)
    const [selectedSessionID, setSelectedSessionID] = useState("")

    const [loading, setLoading] = useState(true);
    const [mode, setMode] = useState(null);
    const [resumeText, setResumeText] = useState("");
    const [jobRole, setJobRole] = useState("");
    const [user, setUser] = useState("");
    const [ready, setReady] = useState(false);
    const [sessionId, setSessionId] = useState("");


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


    useEffect(() => {

      if (!user) return;

      const sessionsReference = collection(firestore, "users", user.uid, "sessions")
      setSessionRef(sessionsReference);

      const unsubscribe = onSnapshot(sessionsReference, (snapshot) => {
          const sessionList = snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
          }));

          setSessions(sessionList);

          const activeSession = sessionList.find(s => s.step && s.step !== "input");
          
          if (activeSession){
            setSelectedSessionID(activeSession.sessionId);


            const type = activeSession.interviewType || null;

            setMode(type);

            if (type === "resume" && activeSession.resumeSummary) {
              setResumeText(activeSession.resumeSummary);
              setReady(true);
            } else if (type === "jobrole" && activeSession.jobRole) {
              setJobRole(activeSession.jobRole);
              setReady(true);
            } else {
              setReady(false);
            }

            setReady(activeSession.step === "ready" || activeSession.step === "chat");
            setJobRole(activeSession.jobRole || "");
            setResumeText(activeSession.resumeSummary || "");
          }

          setLoading(false);
      });

      return () => unsubscribe();
    }, [user]);


    useEffect(() => {
      if (!ready || !selectedSessionID || !sessionsRef) return;

      const sessionDocRef = doc(sessionsRef, selectedSessionID);
      updateDoc(sessionDocRef, {step: "chat"});
    }, [ready, selectedSessionID, sessionsRef]);


    const createSession = async (sessionName, mode) => {
        setMode(mode);
        const sessionId = uuidv4();
        const sessionData = {
            sessionId: sessionId,
            name: sessionName,
            interviewType: mode,
            step: "input",
            createdAt: serverTimestamp(),
        }

        try {

            const sessionDocRef = doc(sessionsRef, sessionId);
            await setDoc(sessionDocRef, sessionData);
            setSelectedSessionID(sessionId);

            
        } catch (error) {
            console.log(error)
            alert("Unable to create session. Please try again.")
        }
    }

    const selectSessionID = async (sessionId, mode) => {
      setMode(mode);
      setSelectedSessionID(sessionId);
    }


    const redirectInterface = async () => {

      if (sessionsRef && selectedSessionID) {
        const sessionDocRef = doc(sessionsRef, selectedSessionID);
        await updateDoc(sessionDocRef, {step: "input"});
      }

      setSelectedSessionID("")
      setReady(false);
      setMode(null)
    }

    
    if (loading) return <Loading />;

    let content;

    if (!selectedSessionID && !mode && !ready){
      content = (
          <SessionsList createSession={createSession} sessions={sessions} selectSessionID={selectSessionID} />          
      )
    } else if (mode && selectedSessionID && !ready){
      content = mode === "resume" ?       
      (
         <UploadResume setResumeText={setResumeText} onComplete={() => setReady(true)} sessionsRef={sessionsRef} selectedSessionID={selectedSessionID} skipIfExists={resumeText} />
      ) : (
        <JobRoleInput setJobRole={setJobRole} onComplete={() => setReady(true)} sessionsRef={sessionsRef} selectedSessionID={selectedSessionID} skipIfExists={jobRole} />
      )
    } else if (mode && selectedSessionID && ready){
      content = (
        <>
          <h2 className="currentModeBox">Interview Coach: {mode === "resume" ? "Resume": "Job Role"} Mode</h2>
          <InterviewChat user={user} sessionId={selectedSessionID} jobRole={jobRole} resumeText={resumeText}  />
        </>
      );
    } else {
      content = <p>Invalid state. Please refresh.</p>
    }


    return (
      <div>
        {content}
        <div style={{display: "flex", justifyContent:"center"}}>
            <button onClick={redirectInterface} style={{marginTop: "30px", width: "200px", fontSize: "15px", fontWeight: "600"}}>Return to Interview Sessions Interface</button>
        </div>
      </div>
    )
    
    // return (
    //     <div>
    //       {!selectedSessionID ? (
    //           <>
    //             <SessionsList createSession={createSession} sessions={sessions} selectSessionID={selectSessionID} />
    //           </>
    //         ) : (
    //           mode ? (
    //             (
    //               mode === "resume" ? (
    //               <UploadResume setResumeText={setResumeText} onComplete={() => setReady(true)} />
    //               ) : (
    //               <JobRoleInput setJobRole={setJobRole} onComplete={() => setReady(true)} />
    //               )
    //           ) : (
    //               <>
    //                 <h2>Interview Coach: {mode === "resume" ? "Resume" : "Job Role"} Mode</h2>
    //                 <InterviewChat user={user} sessionId={selectedSessionID} jobRole={jobRole} resumeText={resumeText}  />
    //               </>          
    //           )
    //         )
    //         )
    //       }
    //       <div style={{display: "flex", justifyContent:"end", marginTop: "90px"}}>
    //         <NavigationButton routeText="dashboard" buttonText="Go Back to Dashboard"  />
    //       </div>
    //     </div>
    // );
}