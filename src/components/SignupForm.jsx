"use client";

import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, firestore } from "../lib/firebaseClient.js"
import { doc, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import NavigationButton from "./NavigationButton.jsx";


export default function SignupForm(){
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    const handleRegister = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            await setDoc(doc(firestore, "users", user.uid), {
                email: user.email,
                role: "user",
                interactions: [],
            });
            
            alert(`You have registered as ${email} successfully!`);
            router.push("/interview-sessions");
        } catch (error) {
            setError(`Registration failed. Please try again.`);
        }
    };

    return (
        <form onSubmit={handleRegister} className="card">
            <div style={{display: "flex", flexDirection: "column", gap: "0.5rem"}}>
                <h2 style={{
                    fontSize: "20px"
                }}><strong><center>Register as a New User</center></strong></h2>

                <input 
                    type="email" 
                    placeholder="Email" 
                    onChange={(e) => setEmail(e.target.value)} 
                    value={email}
                    required
                />

                <input
                    type="password"
                    placeholder="Password"
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                    required
                    minLength={8}
                    maxLength={64}
                />

                {error && <p className="error-text">{error}</p>}

                <button type="submit">Register</button>
                <a href="/login">Already registered? Click here to login</a>
                <NavigationButton routeText="/" buttonText="Exit" className="exit-button" />
            </div>
        </form>
    );

}
