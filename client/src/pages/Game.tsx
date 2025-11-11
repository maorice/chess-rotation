import { useParams, useLocation } from "react-router-dom";
import { useState } from "react";
import { Chessboard } from "react-chessboard";
import FallingEmojiBackground from "../components/FallingEmojiBackground";
import "./Game.css";

function Game() {
  const { gameId } = useParams();
  const location = useLocation();

  // Get player names from navigation state (passed from Waiting page)
  const [playerName] = useState(
    location.state?.username || localStorage.getItem("username") || "Player"
  );
  const [enemyName] = useState(location.state?.enemy_username || "Opponent");
  const [moves] = useState<string[]>(["1. e4 e5", "2. Nf3 Nc6", "3. Bb5 a6"]); // Placeholder moves

  return (
    <div className="game-page">
      <FallingEmojiBackground
        emojis={["♗", "♘", "♖", "♕", "♙", "♔"]}
        count={30}
      />

      <div className="game-container">
        <div className="game-content">
          {/* Left side: Board */}
          <div className="board-section">
            <div className="player-info enemy">
              <div className="player-avatar">⚔️</div>
              <div className="player-name">{enemyName}</div>
            </div>

            <div className="chessboard-wrapper">
              <Chessboard id="game-board" boardWidth={380} />
            </div>

            <div className="player-info player">
              <div className="player-avatar">👤</div>
              <div className="player-name">{playerName}</div>
            </div>
          </div>

          {/* Right side: Move list */}
          <div className="moves-section">
            <h3>Move History</h3>
            <div className="moves-list">
              {moves.length > 0 ? (
                moves.map((move, index) => (
                  <div key={index} className="move-item">
                    {move}
                  </div>
                ))
              ) : (
                <p className="no-moves">No moves yet</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Game;
