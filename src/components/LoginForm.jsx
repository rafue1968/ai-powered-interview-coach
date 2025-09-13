"use client";

import { useState, useTransition } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, firestore } from "../lib/firebaseClient.js"
import { useRouter } from "next/navigation";
import NavigationButton from "./NavigationButton.jsx";

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

      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
  
        const docRef = doc(firestore, "users", user.uid);
        const snap = await getDoc(docRef);
        console.log("Firestore Document:", snap.exists(), snap.data());

        if (snap.exists()){
            const data = snap.data();
            const role = data?.role;

            router.push("/interview-sessions");
        } else {
            setError("User record not found.");
        }
      } catch (err) {
        setError("Login failed. Please try again.");
      }

    };

  
    return (
        <form onSubmit={handleLogin} className="card" >
          <div style={{display: "flex", flexDirection: "column", gap: "0.5rem"}}>
            <h2 style={{
              fontSize: "20px"
            }}><strong><center>Login</center></strong></h2>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password"  required />
            {error && <p className="error-text">{error}</p>}
            <button type="submit">Log In</button>
            <a href="/signup">New here? Click here to sign up</a>
            <NavigationButton routeText="/" buttonText="Exit" className="exit-button" />
          </div>
        </form>

    );
  }