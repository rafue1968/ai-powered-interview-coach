"use client";

// import "./globals.css";
import "../styles/globals.css"
// import { auth } from "../lib/firebaseAdmin";
import { auth } from "../lib/firebaseClient";
import ShowCurrentUserLogoutButton from "../components/ShowCurrentUserLogoutButton"
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";


export default function RootLayout({children}) {

  const [user, setUser] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, [])

  return (
    <html lang="en">
      <body>
        { user ? <ShowCurrentUserLogoutButton /> : "" }
        {children}
      </body>
    </html>
  );
}
