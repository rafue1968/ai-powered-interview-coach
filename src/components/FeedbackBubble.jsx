// File: components/FeedbackBubble.jsx
import React from 'react';

export default function FeedbackBubble({ feedback }) {
  if (!feedback) return null;

  return (
    <div className="mt-4 p-3 bg-green-100 border border-green-300 rounded">
      <p className="text-green-800 font-semibold">AI Feedback:</p>
      <p>{feedback}</p>
    </div>
  );
}
