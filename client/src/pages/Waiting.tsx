import FallingEmojiBackground from "../components/FallingEmojiBackground";
import "./Waiting.css";

export default function Waiting() {
  return (
    <div className="landing-page">
      <FallingEmojiBackground
        emojis={["♗", "♘", "♖", "♕", "♙", "♔"]}
        count={30}
      />
      <div className="center-box">
        <h1>Waiting ...</h1>
      </div>
    </div>
  );
}
