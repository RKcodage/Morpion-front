import MorpionGame from "./MorpionGame";

function App() {
  return (
    <div style={{
      backdropFilter: "blur(8px)",
      WebkitBackdropFilter: "blur(8px)",
    }}>
      <MorpionGame />
    </div>
  );
}

export default App;
