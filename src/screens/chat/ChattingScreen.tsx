/* eslint-disable @typescript-eslint/no-explicit-any */
import { IonIcon } from "@ionic/react";
import axios from "axios";
import CryptoJS from "crypto-js";
import { arrowBackOutline, linkOutline, sendOutline } from "ionicons/icons";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { io, Socket } from "socket.io-client";
import ChatMessage from "../../components/chat/ChatMessage";
import { BASE_URL } from "../../constants/baseUrl";
import { decryptionKey } from "../../libs/encryption";
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

  const [messages, setMessages] = useState<any[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const navigate = useNavigate();
  const userInfo = getLoginUser();

  useEffect(() => {
    if (!userInfo?._id) return;

    const socket = io(`https://chat.tefop.co/chat`, {
      transports: ["websocket"],
      query: { userId: userInfo._id },
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("Connected as user", userInfo._id);
    });

    socket.on("adminReply", (data) => {
      const decrypted = CryptoJS.AES.decrypt(
        data.content,
        decryptionKey
      ).toString(CryptoJS.enc.Utf8);
      setMessages((prev) => [...prev, { sender: "Admin", text: decrypted }]);
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
    setMessages((prev) => [
      ...prev,
      { sender: userInfo.name, text: inputValue.trim() },
    ]);
    setInputValue("");
    inputRef.current?.focus();
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
      const previewUrl = URL.createObjectURL(file);
      setImageFile(file);
      setImagePreview(previewUrl);
    }
  };

  const handleCancelImage = () => {
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImageFile(null);
    setImagePreview(null);
  };

  const handleImageUpload = async () => {
    if (!imageFile || !userInfo?._id) return;

    const formData = new FormData();
    formData.append("photo", imageFile);
    formData.append("senderId", userInfo._id);

    try {
      const response = await axios.post(
        `${BASE_URL}/chat/upload-photo`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      const { photoPath } = response.data;

      setMessages((prev) => [...prev, { senderId: userInfo._id, photoPath }]);

      handleCancelImage();
    } catch (error) {
      console.error("Image upload failed:", error);
    }
  };

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/chat/admin/conversations`
        );
        console.log(response.data);

        const decryptedConversations = response.data.flatMap((conv: any) => {
          return conv.messages.map((msg: any) => {
            if (msg.content.includes("/uploads/chat_photos/")) {
              return {
                sender: msg.senderId === userInfo._id ? userInfo.name : "Admin",
                photoPath: msg.content,
              };
            }

            const decryptedText = CryptoJS.AES.decrypt(
              msg.content,
              decryptionKey
            ).toString(CryptoJS.enc.Utf8);
            return {
              sender: msg.senderId === userInfo._id ? userInfo.name : "Admin",
              text: decryptedText,
            };
          });
        });

        setMessages(decryptedConversations);
      } catch (error) {
        console.error("Error fetching conversations", error);
      }
    };

    fetchConversations();
  }, [userInfo]);

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="mt-10 mx-5 flex items-center">
        <IonIcon
          icon={arrowBackOutline}
          className="size-6"
          onClick={() => navigate(-1)}
        />
        <p className="text-secondary font-bold text-center flex justify-center w-full">
          Chat with Barbie’s Studio
        </p>
      </div>

      {/* Chatting message list */}
      <div
        ref={messageListRef}
        className="flex-1 px-5 py-5 flex flex-col gap-3 overflow-y-auto no-scrollbar"
      >
        {messages.map((msg, index) => (
          <ChatMessage
            key={index}
            variant={
              msg.sender === userInfo.name || msg.senderId === userInfo._id
                ? "send"
                : "receive"
            }
            message={msg.text}
            senderName={msg.sender === userInfo.name ? userInfo.name : ""}
            photo={msg.photoPath}
          />
        ))}
      </div>

      {/* Image Preview */}
      {imagePreview && (
        <div className="px-5 mt-2 relative">
          <img src={imagePreview} alt="Preview" className="w-40 rounded-lg" />
          <button
            onClick={handleCancelImage}
            className="absolute top-0 right-0 bg-red-500 text-white rounded-full px-2 py-1 text-xs"
          >
            ✕
          </button>
          <button
            onClick={handleImageUpload}
            className="mt-2 bg-blue-600 text-white text-xs px-3 py-1 rounded"
          >
            Upload Image
          </button>
        </div>
      )}

      {/* Sticky Send Message Input */}
      <div className="sticky bottom-0 w-full px-3 pb-5 pt-3">
        <div className="bg-white rounded-xl p-3 flex items-center gap-5 border border-gray-200 shadow-sm">
          <input
            ref={inputRef}
            type="text"
            placeholder="Type your text message"
            className="w-full outline-none text-sm"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSendMessage();
            }}
          />

          {/* image input */}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            id="image-upload"
            onChange={handleImageSelect}
          />
          <label htmlFor="image-upload">
            <IonIcon
              icon={linkOutline}
              className="size-6 cursor-pointer pt-1.5"
            />
          </label>

          {/* text send icon */}
          <IonIcon
            icon={sendOutline}
            className={`size-6 ${
              !inputValue.trim() ? "opacity-30" : "cursor-pointer"
            }`}
            onClick={handleSendMessage}
          />
        </div>
      </div>
    </div>
  );
};

export default ChattingScreen;
