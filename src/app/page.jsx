"use client";

import NavigationButton from "../components/NavigationButton"

export default function Home() {
  return (
    <main className="p-6">
      <h1 className="text-3xl font-bold">AI Interview Coach</h1>
      <p>Get ready for your interviews with intelligent, real-time feedback.</p>
      <NavigationButton routeText="login" buttonText="Login" />
      <NavigationButton routeText="signup" buttonText="Sign Up" />
    </main>
  );
}
