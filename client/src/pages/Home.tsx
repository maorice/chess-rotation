import UsernameBox from "../components/UsernameBox.tsx";
import QueueButton from "../components/QueueButton.tsx";

function Home() {
  console.log("rendering home page");
  return (
    <>
      <h1>Chess Rotation</h1>
      <UsernameBox />
      <QueueButton />
    </>
  );
}

export default Home;
