import React, { useState, useEffect } from "react";
import "./FallingEmojiBackground.css";

interface FallingEmojiBackgroundProps {
  emojis?: string[];
  count?: number;
}

export default function FallingEmojiBackground({
  emojis = ["🎉", "♟️", "✨", "🔥", "👑", "🪄"],
  count = 30,
}: FallingEmojiBackgroundProps) {
  const [emojiElements, setEmojiElements] = useState<JSX.Element[]>([]);

  useEffect(() => {
    const getRandomStyle = () => ({
      left: `${Math.random() * 100}vw`,
      fontSize: `${12 + Math.random() * 24}px`,
      animationDuration: `${5 + Math.random() * 10}s`,
      animationDelay: `${Math.random() * 5}s`,
    });

    const elements = Array.from({ length: count }).map((_, i) => (
      <span key={i} className="emoji" style={getRandomStyle()}>
        {emojis[Math.floor(Math.random() * emojis.length)]}
      </span>
    ));

    setEmojiElements(elements);
  }, [count, emojis]); // runs only once per mount unless props change

  return <div className="falling-emojis">{emojiElements}</div>;
}
