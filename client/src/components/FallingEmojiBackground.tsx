import React, { memo } from "react";
import "./FallingEmojiBackground.css";

interface FallingEmojiBackgroundProps {
  emojis?: string[];
  count?: number;
}

const FallingEmojiBackground = memo(function FallingEmojiBackground({
  emojis = ["🎉", "✨", "♟️", "🔥", "🪄"],
  count = 30,
}: FallingEmojiBackgroundProps) {
  const elements = Array.from({ length: count }).map((_, i) => {
    const style = {
      left: `${Math.random() * 100}vw`,
      fontSize: `${20 + Math.random() * 30}px`,
      animationDuration: `${5 + Math.random() * 10}s`,
      animationDelay: `${Math.random() * 5}s`,
    };
    return (
      <span key={i} className="emoji" style={style}>
        {emojis[Math.floor(Math.random() * emojis.length)]}
      </span>
    );
  });

  return <div className="falling-emojis">{elements}</div>;
});

export default FallingEmojiBackground;
