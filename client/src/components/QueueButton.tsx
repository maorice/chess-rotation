import { useContext } from "react";
import { WSContext, useWS } from "../context/WSContext";

interface QueueButtonProps {
  username: string;
}

function QueueButton({ username }: QueueButtonProps) {
  const { connect, send } = useWS();

  const joinQueue = () => {
    connect();
    send({
      type: "JOIN_QUEUE",
      args: { username },
    });
  };

  return <button onClick={joinQueue}>Join Queue</button>;
}

export default QueueButton;
