type Player = {
  socketId: string;
  pseudo: string;
  symbol: "X" | "O";
};

type Room = {
  name: string;
  players: Player[];
  board: string[];
  currentTurn: "X" | "O";
  status: "waiting" | "playing" | "finished";
};

type GameStatusProps = {
  room: Room;
  me: Player | undefined;
  winner: "X" | "O" | "draw" | null;
};

export default function GameStatus({ room, me, winner }: GameStatusProps) {
  return (
    <>
      <div style={{ marginBottom: 8 }}>
        <strong>Joueurs :</strong>{" "}
        {room.players.map((p, i) => (
          <span key={p.socketId}>
            {p.pseudo} ({p.symbol})
            {p.socketId === me?.socketId && " (vous)"}
            {i < room.players.length - 1 && " & "}
          </span>
        ))}
      </div>
      <div>
        {winner !== null
          ? winner === "draw"
            ? "🤝 Match nul !"
            : me?.symbol === winner
            ? "🏆 Bravo, tu as gagné !"
            : "😢 Tu as perdu !"
          : room.status === "waiting"
          ? "En attente d'un adversaire…"
          : room.status === "playing"
          ? me && room.currentTurn === me.symbol
            ? "À ton tour !"
            : "Tour de l'adversaire"
          : ""}
      </div>
    </>
  );
}
