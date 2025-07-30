"use client";

import { useState, useTransition } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, firestore } from "../lib/firebaseClient.js" //"../../lib/firebase.js";
import { useRouter } from "next/navigation";
// import { login } from "../actions/login.js" //"app/actions/login";
// import { login } from "app/actions/login.js";

export default function LoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [useRole, setUserRole] = useState("")
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
  
    const handleLogin = async (e) => {
      e.preventDefault();
      setError("");
      
  
      // const loginResult =  await login(email, password);

      // if (loginResult?.error){
      //   setError(loginResult.error)
      // } else {
      //   const { role } = loginResult;
      //   console.log("Login page user role: ", role);
        
      //   if (role === "admin") {
      //     router.push("/admin");
      //   } else if (role === "user") {
      //     router.push("/user");
      //   } else {
      //     setError("Invalid role.")
      //   }
      // }

      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        console.log("Firebase User:", user);
  
        const docRef = doc(firestore, "users", user.uid);
        const snap = await getDoc(docRef);
        console.log("Firestore Document:", snap.exists(), snap.data());

        // await login(email, password)

        if (snap.exists()){
            const data = snap.data();
            const role = data?.role;

            console.log(role);

            router.push("/dashboard");
  
            // if (role === "admin") {
            // router.push("/admin");
            // } else if (role === "user") {
            // router.push("/user");
            // } else {
            //     setError("Invalid role.")
            // }
        } else {
            setError("User record not found.");
        }

        // const userData = login(email, password);
        // setUserRole(userData.role);
        
        // if (role === "admin") {
        // router.push("/admin");
        // } else if (role === "user") {
        // router.push("/user");
        // } else {
        //     setError("Invalid role.")
        // }
      } catch (err) {
        setError("Login failed: " + err.message);
      }

    };



    // const handleLogin = (e) => {
    //   e.preventDefault();
    //   setError("");

    //   startTransition(async ()=> {
    //     const result = await login(email, password);

    //     if (result?.error){
    //       setError(result.error);
    //     } else {
    //       const role = result.role;
    //       if (role == "admin"){
    //         router.push("/admin");
    //       } else if (role == "user"){
    //         router.push("/user");
    //       } else {
    //         setError("Unknown user role");
    //       }
    //     }
    //   })
    // }
  
    return (
      // <div className="card">
        <form onSubmit={handleLogin} className="card" >
          <div style={{display: "flex", flexDirection: "column", gap: "0.5rem"}}>
            <h2>Login</h2>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password"  required />
            <button type="submit">Log In</button>
            <a href="/signup">New here? Click here to sign up</a>
            {/* <button><a href="/">Go back to Home Page</a></button> */}
          </div>
        </form>
      // </div>

    );
  }