import { useState } from "react";

import UsernameBox from "../components/UsernameBox.tsx";
import QueueButton from "../components/QueueButton.tsx";

function Home() {
  const [username, setUsername] = useState<string>("");
  return (
    <>
      <h1>Chess Rotation</h1>
      <UsernameBox username={username} setUsername={setUsername} />
      <QueueButton username={username} />
    </>
  );
}

export default Home;
