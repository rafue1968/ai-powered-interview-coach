"use client";

import "../styles/globals.css"
import { auth } from "../lib/firebaseClient";
import ShowCurrentUserLogoutButton from "../components/ShowCurrentUserLogoutButton"
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import InstructionsPopup from "../components/InstructionsPopup"


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
        <InstructionsPopup />
      </body>
    </html>
  );
}
