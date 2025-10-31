import { useNavigate } from "react-router-dom";

function QueueButton() {
  const navigate = useNavigate();

  const handleQueue = async () => {
    // Get username from localStorage or pass it as a prop
    const username = localStorage.getItem("username");

    if (!username || username.trim() === "") {
      alert("Please enter a username first");
      return;
    }

    // TODO: replace this with websocket connection request and refactor my app to use ws context
    try {
      const response = await fetch("http://localhost:8080/connect", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username }),
      });

      if (response.ok) {
        // Navigate to waiting page on success
        navigate("/waiting");
      } else {
        alert("Failed to connect to server");
      }
    } catch (error) {
      console.error("Error connecting to server:", error);
      alert("Could not connect to server");
    }
  };

  return (
    <button
      onClick={handleQueue}
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
    >
      Queue
    </button>
  );
}

export default QueueButton;
