import UsernameBox from "../components/UsernameBox";
import QueueButton from "../components/QueueButton";
import FallingEmojiBackground from "../components/FallingEmojiBackground";
import "./Home.css";

export default function Home() {
  return (
    <div className="landing-page">
      <FallingEmojiBackground emojis={["🎉", "✨"]} count={30} />
      <div className="center-box">
        <h1>Chess Rotation</h1>
        <UsernameBox />
        <QueueButton />
      </div>
    </div>
  );
}
