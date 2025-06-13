import React from "react";

type LobbyProps = {
  pseudo: string;
  roomName: string;
  onPseudoChange: (s: string) => void;
  onRoomNameChange: (s: string) => void;
  onCreate: (e: React.FormEvent) => void;
  onJoin: (e: React.FormEvent) => void;
  error: string | null;
};

export default function Lobby({
  pseudo,
  roomName,
  onPseudoChange,
  onRoomNameChange,
  onCreate,
  onJoin,
  error,
}: LobbyProps) {
  return (
    <div style={{ maxWidth: 400, margin: "2rem auto", padding: 24, border: "1px solid #ddd", borderRadius: 8, display: "flex", flexDirection: "column", justifyContent:"center", alignItems: "center" }}>
      <h2>Morpion en ligne</h2>
      <form onSubmit={onCreate} style={{ marginBottom: 16 }}>
        <input
          type="text"
          placeholder="Votre pseudo"
          value={pseudo}
          onChange={(e) => onPseudoChange(e.target.value)}
          style={{ width: "95%", marginBottom: 8, padding: 8 }}
          autoFocus
        />
        <input
          type="text"
          placeholder="Nom de la partie"
          value={roomName}
          onChange={(e) => onRoomNameChange(e.target.value)}
          style={{ width: "95%", marginBottom: 8, padding: 8 }}
        />
        <button type="submit" style={{ width: "100%", padding: 10, background: "#5050ff", color: "#fff", border: "none", borderRadius: 4 }}>
          Créer une partie
        </button>
      </form>
      <form onSubmit={onJoin}>
        <button type="submit" style={{ width: "100%", padding: 10, background: "#2c9b1f", color: "#fff", border: "none", borderRadius: 4 }}>
          Rejoindre la partie
        </button>
      </form>
      {error && <div style={{ marginTop: 12, color: "#c00" }}>{error}</div>}
    </div>
  );
}
