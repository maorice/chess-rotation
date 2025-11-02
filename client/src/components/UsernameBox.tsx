import { useState } from "react";

interface UsernameBoxProps {
  username: string;
  setUsername: (username: string) => void;
}

function UsernameBox({ username, setUsername }: UsernameBoxProps) {
  return (
    <>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="username"
      />
    </>
  );
}

export default UsernameBox;
