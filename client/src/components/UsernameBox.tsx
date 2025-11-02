import { useState, useEffect } from "react";

function UsernameBox() {
  const [username, setUsername] = useState(() => {
    return localStorage.getItem("username") || "";
  });

  useEffect(() => {
    localStorage.setItem("username", username);
  }, [username]);

  return (
    <input
      type="text"
      value={username}
      onChange={(e) => setUsername(e.target.value)}
      placeholder="username"
    />
  );
}

export default UsernameBox;
