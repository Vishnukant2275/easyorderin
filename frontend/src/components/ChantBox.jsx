import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000"); // backend ka URL

function ChatBox() {
  const [msg, setMsg] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.on("receiveMessage", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => socket.off("receiveMessage");
  }, []);

  const send = () => {
    socket.emit("sendMessage", msg);
    setMsg("");
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Socket.io Chat</h2>
      {messages.map((m, i) => (
        <p key={i}>{m}</p>
      ))}
      <input value={msg} onChange={(e) => setMsg(e.target.value)} />
      <button onClick={send}>Send</button>
    </div>
  );
}

export default ChatBox;
