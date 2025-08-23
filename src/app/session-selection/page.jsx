// import { addDoc, collection, getDoc, onSnapshot, serverTimestamp, setDoc } from "firebase/firestore"
// import { firestore, auth } from "../../lib/firebaseClient"
// import { useEffect, useState } from "react";
// import Loading from "../../components/Loading"
// import { v4  as uuidv4 } from "uuid"

// export default function Page(){
//     const [sessions, setSessions] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [user, setUser] = useState("");
//     const [sessionsRef, setSessionRef] = useState(null)
//     const [selectedSession, setSelectedSession] = useState("")



//     useEffect(() => {
//         setUser(auth.currentUser)

//         const sessionsReference = collection(firestore, "users", user.uid, "sessions")
//         setSessionRef(sessionsReference);

//         const unsubscribe = onSnapshot(sessionsRef, (snapshot) => {
//             const sessionList = snapshot.docs.map((doc) => ({
//                 id: doc.id,
//                 ...doc.data(),
//             }));

//             setSessions(sessionList);
//             setLoading(false);
//         });

//         return () => unsubscribe();
//     }, []);


//     const createSession = async () => {

//         const sessionId = uuidv4();

//         const sessionData = {
//             sessionId: sessionId,
//             createdAt: serverTimestamp(),
//             name: ,
//         }

//         try {
//             await setDoc(sessionsRef, sessionData);
//             setSelectedSession(sessionId);
            
//         } catch (error) {
//             console.log(error)
//             alert("Unable to create session. Please try again.")
//         }
//     }

//     if (loading) return <Loading />

//     return (
//         <>
//             <ul>
//                 {sessions.map((session)=> {
//                     <li key={session.id}>{JSON.stringify(session)}</li>
//                 })}
//             </ul>
//         </>
//     )

// }