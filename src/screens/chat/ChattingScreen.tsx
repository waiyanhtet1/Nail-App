import { IonIcon } from "@ionic/react";
import axios from "axios";
import { arrowBackOutline, linkOutline, sendOutline } from "ionicons/icons";
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import ChatMessage from "../../components/chat/ChatMessage";
import { BASE_URL } from "../../constants/baseUrl";
import { getLoginUser } from "../../libs/userUtils";

const ChattingScreen = () => {
  const navigate = useNavigate();
  const userInfo = getLoginUser();

  const socketRef = useRef<WebSocket | null>(null);
  const messageListRef = useRef<HTMLDivElement | null>(null);

  const [messages, setMessages] = useState<{ sender: string; text: string }[]>(
    []
  );
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    if (!userInfo) {
      navigate("/login");
      return;
    }

    socketRef.current = new WebSocket(
      `wss://backend.tefop.co/chat?userId=${userInfo._id}}`
    );

    socketRef.current.onopen = () => {
      console.log("WebSocket connected");
      socketRef.current?.send(
        JSON.stringify({
          type: "clientMessage",
          senderId: userInfo._id,
          content: "Hello thuta !",
        })
      );
    };

    socketRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("Message from server:", data);
      setMessages((prev) => [...prev, data]);
    };

    socketRef.current.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    socketRef.current.onclose = () => {
      console.log("WebSocket closed");
    };

    return () => {
      socketRef.current?.close();
    };
  }, [navigate, userInfo]);

  useEffect(() => {
    // Auto-scroll to bottom when messages update
    messageListRef.current?.scrollTo({
      top: messageListRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const messageData = {
      sender: userInfo.name,
      text: inputValue.trim(),
    };

    socketRef.current?.send(JSON.stringify(messageData));
    setMessages((prev) => [...prev, messageData]);
    setInputValue("");
  };

  const getMessages = useCallback(async () => {
    try {
      const { data } = await axios.get(
        `${BASE_URL}/chat/messages/${userInfo._id}`
      );
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  }, [userInfo._id]);

  useEffect(() => {
    getMessages();
  }, [getMessages]);

  return (
    <div className="mt-10 mx-5">
      {/* back and title */}
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

      <p className="text-xs text-secondary text-center mt-1">online</p>

      {/* chatting message list */}
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

      {/* send message */}
      <div className="bg-white rounded-xl p-3 flex items-center gap-5">
        <input
          type="text"
          placeholder="Type your text message"
          className="w-full outline-none text-sm"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSendMessage();
          }}
        />
        <IonIcon icon={linkOutline} className="size-7" />
        <IonIcon
          icon={sendOutline}
          className="size-6"
          onClick={handleSendMessage}
        />
      </div>
    </div>
  );
};

export default ChattingScreen;
