type GameBoardProps = {
  board: string[];
  disabled: boolean;
  onCellClick: (index: number) => void;
};

export default function GameBoard({ board, disabled, onCellClick }: GameBoardProps) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 80px)",
        gap: 5,
        margin: "20px auto",
        paddingBottom: "19px",
      }}
    >
      {board.map((cell, i) => (
        <button
          key={i}
          onClick={() => onCellClick(i)}
          disabled={!!cell || disabled}
          style={{
            width: 60,
            height: 60,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
            fontSize: "2rem",
            cursor: cell || disabled ? "default" : "pointer",
            color: cell === "X" ? "#1F3476" : cell === "O" ? "#8D3299" : "#2C6474", 
            background: "#fff",
            border: "2px solid #5050ff",
            borderRadius: 6,
          }}
        >
          {cell}
        </button>
      ))}
    </div>
  );
}
