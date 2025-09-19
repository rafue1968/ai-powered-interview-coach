"use client";

import NavigationButton from "../components/NavigationButton";

export default function Home() {
  return (
    <div className="body-home">
      <h1>AI-Powered Interview Coach</h1>
      <main className="homeDiv">
        <p className="home-intro">
          Prepare for your interviews with personalized guidance, real-time feedback, and AI-driven responses to help you shine.
          </p>
        <div className="button-group">
          <NavigationButton routeText="login" buttonText="Login" className="login-button" />
          <NavigationButton routeText="signup" buttonText="Sign Up" className="signup-button" />
        </div>
      </main>
    </div>
  );
}
