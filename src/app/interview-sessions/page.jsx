"use client";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { collection, onSnapshot } from "firebase/firestore";
import { firestore, auth } from "../../lib/firebaseClient";
import { useRouter } from "next/navigation";
import Loading from "../../components/Loading";
import SessionsList from "../../components/SessionsList";

export default function Page() {
  const router = useRouter();
  const [sessions, setSessions] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) setUser(user);
      else router.push("/login");
      setLoading(false);
    });
    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    if (!user) return;

    const ref = collection(firestore, "users", user.uid, "sessions");
    const unsubscribe = onSnapshot(ref, (snapshot) => {
      const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setSessions(list);
    });
    return () => unsubscribe();
  }, [user]);

  const navigateToSession = (id) => {
    router.push(`/interview-sessions/${id}/input`);
  };

  if (loading) return <Loading />;

  return (
    <SessionsList
      sessions={sessions}
      createSession={(name, type) => {
        router.push(`/interview-sessions/new?name=${name}&type=${type}`);
      }}
      selectSessionID={navigateToSession}
    />
  );
}
