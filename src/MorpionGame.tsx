import React, { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import Lobby from "./components/Lobby";
import GameBoard from "./components/GameBoard";
import GameStatus from "./components/GameStatus";

const SOCKET_URL = "http://localhost:3000"; 

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

export default function MorpionGame() {
  const socketRef = useRef<Socket | null>(null);

  // LOBBY
  const [pseudo, setPseudo] = useState("");
  const [roomName, setRoomName] = useState("");
  const [isInRoom, setIsInRoom] = useState(false);

  // GAME
  const [room, setRoom] = useState<Room | null>(null);
  const [winner, setWinner] = useState<"X" | "O" | null | "draw">(null);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  useEffect(() => {
    const socket = io(SOCKET_URL);
    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("🟢 Connecté au backend :", socket.id);
    });

    socket.on("gameCreated", ({ room }) => {
      setRoom(room);
      setIsInRoom(true);
      setInfo("Partie créée, en attente d'un joueur...");
    });

    socket.on("gameStarted", ({ room }) => {
      setRoom(room);
      setIsInRoom(true);
      setInfo("La partie démarre !");
    });

    socket.on("movePlayed", ({ room }) => {
      console.log("movePlayed:", room.board);
      setRoom(room);
      setInfo(null);
    });

    socket.on("gameOver", ({ room, winner }) => {
      setRoom(room);
      setWinner(winner ?? "draw");
      setInfo(null);
    });

    socket.on("gameCancelled", ({ message }) => {
      setError(message || "Partie annulée.");
      setRoom(null);
      setIsInRoom(false);
      setWinner(null);
      setInfo(null);
    });

    socket.on("error", (data) => {
      setError(data.message);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const me = room?.players.find((p) => p.socketId === socketRef.current?.id);

  // Handlers lobby
  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setInfo(null);
    if (pseudo.trim() && roomName.trim()) {
      socketRef.current?.emit("createGame", { roomName, pseudo });
    }
  };
  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setInfo(null);
    if (pseudo.trim() && roomName.trim()) {
      socketRef.current?.emit("joinGame", { roomName, pseudo });
    }
  };

  // Handler plateau
  const handleCellClick = (index: number) => {
    if (
      !room ||
      room.status !== "playing" ||
      winner ||
      !me ||
      room.currentTurn !== me.symbol ||
      room.board[index]
    ) {
      return;
    }
    socketRef.current?.emit("playMove", { roomName: room.name, index });
    console.log("playMove envoyé :", { roomName: room.name, index });
  };

  // Reset
  const handleReset = () => {
    setRoom(null);
    setWinner(null);
    setIsInRoom(false);
    setError(null);
    setInfo(null);
    setPseudo("");
    setRoomName("");
  };

  if (!isInRoom || !room) {
    return (
      <Lobby
        pseudo={pseudo}
        roomName={roomName}
        onPseudoChange={setPseudo}
        onRoomNameChange={setRoomName}
        onCreate={handleCreate}
        onJoin={handleJoin}
        error={error}
      />
    );
  }

  return (
    <div style={{ width: 600, margin: "2rem auto", padding: 24, border: "1px solid #ddd", borderRadius: 8, display: "flex", flexDirection: "column", textAlign: "center" }}>
      <h2>Morpion en ligne</h2>
      <GameStatus room={room} me={me} winner={winner} />
      <GameBoard
        board={room.board}
        disabled={
          !!winner ||
          !me ||
          room.currentTurn !== me.symbol ||
          room.status !== "playing"
        }
        onCellClick={handleCellClick}
      />
      {(winner !== null || error) && (
        <button onClick={handleReset} style={{ marginTop: 16, width: "50%", padding: 10, margin: "20px auto" }}>
          Retour au lobby
        </button>
      )}
      {info && <div style={{ marginTop: 16 }}>{info}</div>}
      {error && <div style={{ marginTop: 12, color: "#c00" }}>{error}</div>}
    </div>
  );
}
