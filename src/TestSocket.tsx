import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";

const SOCKET_URL = "http://localhost:3000"; // adapte si besoin

export default function TestSocket() {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const socket = io(SOCKET_URL);
    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("🟢 Connecté au backend :", socket.id);

      // Test : créer une partie
      socket.emit("createGame", { roomName: "room-test", pseudo: "Rayan" });
    });

    socket.on("gameCreated", ({ room }) => {
      console.log("🎲 Partie créée :", room);
      // Ici, tu peux faire un setState pour afficher sur le front si tu veux
    });

    socket.on("gameStarted", ({ room }) => {
      console.log("🚀 Partie démarrée :", room);
    });

    socket.on("error", (data) => {
      console.log("❌ Erreur :", data.message);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div>
      <h2>Test Socket.io Backend</h2>
      <p>Regarde la console pour voir les logs !</p>
    </div>
  );
}
