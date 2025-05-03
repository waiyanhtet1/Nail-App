import { IonIcon } from "@ionic/react";
import { arrowBackOutline, linkOutline, sendOutline } from "ionicons/icons";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { io, Socket } from "socket.io-client";
import ChatMessage from "../../components/chat/ChatMessage";
import { getLoginUser } from "../../libs/userUtils";

interface ServerToClientEvents {
  adminReply: (data: { content: string }) => void;
}

interface ClientToServerEvents {
  message: (data: string) => void;
}

const ChattingScreen = () => {
  const socketRef = useRef<Socket<
    ServerToClientEvents,
    ClientToServerEvents
  > | null>(null);
  const messageListRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>(
    []
  );
  const [inputValue, setInputValue] = useState("");
  const navigate = useNavigate();

  const userInfo = getLoginUser();

  useEffect(() => {
    if (!userInfo?._id) return;

    const socket = io(`https://chat.tefop.co`, {
      transports: ["websocket"],
      query: { userId: userInfo._id },
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("Connected as user", userInfo._id);
    });

    socket.on("adminReply", (data) => {
      console.log("adminReply", data);
      setMessages((prev) => [...prev, { sender: "Admin", text: data.content }]);
    });

    socket.on("connect_error", (err) => {
      console.error("Connection error:", err);
    });

    return () => {
      socket.disconnect();
    };
  }, [userInfo]);

  useEffect(() => {
    messageListRef.current?.scrollTo({
      top: messageListRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  const handleSendMessage = () => {
    if (!inputValue.trim() || !socketRef.current) return;

    const payload = JSON.stringify({
      type: "clientMessage",
      senderId: userInfo._id,
      content: inputValue.trim(),
    });

    socketRef.current.send(payload);
    console.log("sended message");

    setMessages((prev) => [
      ...prev,
      { sender: userInfo.name, text: inputValue.trim() },
    ]);
    setInputValue("");
    inputRef.current?.focus();
  };

  return (
    <div className="mt-10 mx-5">
      {/* Back and title */}
      <div className="flex items-center">
        <IonIcon
          icon={arrowBackOutline}
          className="size-6"
          onClick={() => navigate(-1)}
        />
        <p className="text-secondary font-bold text-center flex justify-center w-full">
          Chat with Barbie’s Studio
        </p>
      </div>

      <>
        {/* Chatting message list */}
        <div
          ref={messageListRef}
          className="py-5 flex flex-col gap-3 overflow-y-scroll h-[calc(100vh-150px)] no-scrollbar"
        >
          {messages.map((msg, index) => (
            <ChatMessage
              key={index}
              variant={msg.sender === userInfo.name ? "send" : "receive"}
              message={msg.text}
              senderName={msg.sender === userInfo.name ? userInfo.name : ""}
            />
          ))}
        </div>

        {/* Send message input */}
        <div className="bg-white rounded-xl p-3 flex items-center gap-5">
          <input
            ref={inputRef}
            type="text"
            placeholder="Type your text message"
            className="w-full outline-none text-sm"
            value={inputValue}
            // disabled={isConnecting}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSendMessage();
            }}
          />
          <IonIcon icon={linkOutline} className="size-7" />
          <IonIcon
            icon={sendOutline}
            className={`size-6 ${
              !inputValue.trim() ? "opacity-30" : "cursor-pointer"
            }`}
            onClick={handleSendMessage}
          />
        </div>
      </>
      {/* )} */}
    </div>
  );
};

export default ChattingScreen;
