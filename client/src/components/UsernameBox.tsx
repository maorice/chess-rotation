import { useState } from "react";

function UsernameBox() {
  const [username, setUsername] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUsername(value);
    localStorage.setItem("username", value);
  };

  return (
    <input
      type="text"
      value={username}
      onChange={handleChange}
      placeholder="Enter username"
      className="border border-gray-300 rounded px-4 py-2 mb-4"
    />
  );
}

export default UsernameBox;
