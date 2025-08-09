"use client";

export default function MessageBubble({ message }) {
  const isUser = message.sender === "user";
  return (
    <div style={{ textAlign: isUser ? "right" : "left", margin: "10px" }}>
      <div
        style={{
          display: "inline-block",
          padding: "10px",
          borderRadius: "10px",
          backgroundColor: isUser ? "#214108" : "#242121",
        }}
      >
        {message.text}
      </div>
    </div>
  );
}
