import { useNavigate } from "react-router-dom";
import { useWS } from "../context/WSContext";
import { useRef } from "react";

function QueueButton() {
  const { connect, send, subscribe } = useWS();
  const navigate = useNavigate();
  const unsubscribeRef = useRef<(() => void) | null>(null);

  const joinQueue = async () => {
    const username = localStorage.getItem("username");
    if (!username) return alert("Please enter a username!");

    if (unsubscribeRef.current) {
      unsubscribeRef.current();
    }

    await connect();

    unsubscribeRef.current = subscribe("QUEUE_JOINED", () => {
      navigate("/waiting");
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }
    });

    send({
      type: "JOIN_QUEUE",
      args: { username },
    });
  };

  return <button onClick={joinQueue}>Join Queue</button>;
}

export default QueueButton;
