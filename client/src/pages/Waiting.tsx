import FallingEmojiBackground from "../components/FallingEmojiBackground";
import { useWS } from "../context/WSContext";
import { useNavigate } from "react-router-dom";
import "./Waiting.css";
import { useEffect } from "react";

export default function Waiting() {
  const { subscribe } = useWS();
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = subscribe("MATCH_FOUND", (msg) => {
      // Extract gameId from the message args
      const gameID = msg.args.gameID;
      const username = msg.args.username;
      const enemy_username = msg.args.enemy_username;

      if (gameID) {
        console.log(`[DEBUG]: Match found, navigating to game ${gameID}`);
        console.log(
          `[DEBUG]: Players - You: ${username}, Opponent: ${enemy_username}`
        );

        // Navigate with player names in state
        navigate(`/game/${gameID}`, {
          state: {
            username: username,
            enemy_username: enemy_username,
          },
        });
      } else {
        console.error("[ERROR]: MATCH_FOUND message missing gameId");
      }
    });

    // Cleanup subscription when component unmounts
    return () => {
      unsubscribe();
    };
  }, [subscribe, navigate]);

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
