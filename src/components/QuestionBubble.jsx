// File: components/QuestionBubble.jsx
import React from 'react';

export default function QuestionBubble({ question }) {
  if (!question) return null;

  return (
    <div className="mt-4 p-3 bg-blue-100 border border-blue-300 rounded">
      <p className="text-blue-800 font-semibold">Interview Question:</p>
      <p>{question}</p>
    </div>
  );
}
