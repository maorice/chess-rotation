import { useWS } from "../context/WSContext";

function QueueButton() {
  const { connect, send } = useWS();

  const joinQueue = async () => {
    const username = localStorage.getItem("username");
    if (!username) return alert("Please enter a username!");

    await connect();
    send({
      type: "JOIN_QUEUE",
      args: { username },
    });

    // TODO: route to queue page
  };

  return <button onClick={joinQueue}>Join Queue</button>;
}

export default QueueButton;
