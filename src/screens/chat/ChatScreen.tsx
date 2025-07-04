// ChatScreen.tsx
import { IonIcon } from "@ionic/react";
import { arrowBack } from "ionicons/icons";
import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createChannel, getStreamMessages, sendMessage } from "../../libs/api";
import { getLoginUser } from "../../libs/userUtils";
import { Message, SendMessagePayload } from "../../types/types";
import MessageInput from "./MessageInput";
import MessageList from "./MessageList";

// IMPORTANT: Ensure your REACT_APP_API_BASE_URL is set in your .env file
// e.g., REACT_APP_API_BASE_URL=http://localhost:3000

// This should ideally come from an authentication context or prop
// const USER_ID: string = "68642329f35af7eb6baf1aab";

const ChatScreen: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [channelId, setChannelId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const userInfo = getLoginUser();
  const navigate = useNavigate();

  const USER_ID: string = userInfo._id;

  // --- 1. Channel Management (Create Channel Once, Fetch ID) ---
  // This effect runs once on component mount to initialize or retrieve the channelId.
  useEffect(() => {
    const initializeChannel = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Attempt to get channelId from local storage first for persistence
        const storedChannelId = localStorage.getItem("chatChannelId");
        if (storedChannelId) {
          setChannelId(storedChannelId);
          console.log("Using stored channel ID:", storedChannelId);
        } else {
          // If no stored channelId, create a new one via API
          console.log("Creating new channel...");
          const response = await createChannel(USER_ID);
          const newChannelId = response.channelId; // Access directly due to CreateChannelResponse type
          setChannelId(newChannelId);
          localStorage.setItem("chatChannelId", newChannelId); // Store for future visits
          console.log("New channel created:", newChannelId);
        }
      } catch (err) {
        console.error("Error initializing channel:", err);
        // Provide a user-friendly error message
        setError("Failed to initialize chat channel. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    initializeChannel();
  }, []); // Empty dependency array ensures this runs only once on mount

  useEffect(() => {
    if (!channelId) return;

    const fetchMessages = async () => {
      try {
        const response = await getStreamMessages(channelId);
        const newMessages: Message[] = response.data;

        setMessages(newMessages); // Replace or merge depending on your strategy
      } catch (error) {
        console.error("Polling error:", error);
        setError("Error fetching messages.");
      }
    };

    // Fetch initially
    fetchMessages();

    // Set interval
    const intervalId = setInterval(fetchMessages, 3000); // every 3 seconds

    return () => {
      clearInterval(intervalId); // Cleanup on unmount
    };
  }, [channelId]);

  // --- 3. Send Message Functionality (POST /stream/send-message) ---
  const handleSendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || !channelId) return; // Prevent sending empty messages or if no channel

      // Optimistic UI update: Add message to UI immediately
      const optimisticMessage: Message = {
        channelId: channelId,
        userId: USER_ID,
        text: text,
        created_at: new Date().toISOString(), // Client-side timestamp
        id: `temp-${Date.now()}`, // Temporary unique ID for optimistic message
        isOptimistic: true, // Flag to indicate it's an optimistic update
      };

      setMessages((prevMessages) => [...prevMessages, optimisticMessage]);

      try {
        const payload: SendMessagePayload = {
          channelId,
          userId: USER_ID,
          text,
        };
        await sendMessage(payload);
        // No need to explicitly remove optimistic message, as the SSE stream
        // will eventually push the "real" message from the server, which
        // will naturally appear in the list.
      } catch (err) {
        console.error("Error sending message:", err);
        setError("Failed to send message. Please try again.");
        // Revert optimistic update if sending fails
        setMessages((prevMessages) =>
          prevMessages.filter((msg) => msg.id !== optimisticMessage.id)
        );
      }
    },
    [channelId]
  ); // Re-create callback if channelId changes

  // --- Render Loading, Error, or Chat UI ---
  if (isLoading) {
    return (
      <div className="flex flex-col w-11/12 md:w-3/4 lg:w-1/2 mx-auto mt-5 justify-center items-center">
        <p className="text-xl text-gray-700">Loading chat...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col h-[90vh] w-11/12 md:w-3/4 lg:w-1/2 mx-auto mt-5 justify-center items-center">
        <p className="text-red-500 p-5 text-center">{error}</p>
      </div>
    );
  }

  return (
    <div className="relative h-screen flex flex-col">
      {/* --- Header (Sticky Top) --- */}
      <div className="fixed top-0 left-0 right-0 z-10 px-5 py-5">
        <div className="flex items-center">
          <IonIcon
            icon={arrowBack}
            className="w-5 h-5"
            onClick={() => navigate(-1)}
          />
          <div className="flex justify-center w-full font-bold text-lg">
            <p className="text-gray-800">Chat with Barbie’s Studio</p>
          </div>
        </div>
        <p className="text-center text-xs text-secondary mt-1">online</p>
      </div>

      {/* --- Message List Area (Scrollable) --- */}
      <div className="flex-1 mt-[80px] mb-[80px] overflow-y-auto px-5">
        <MessageList messages={messages} currentUserId={USER_ID} />
      </div>

      {/* --- Message Input (Sticky Bottom) --- */}
      <div className="fixed bottom-0 left-0 right-0  z-10 px-5 py-3">
        <MessageInput onSendMessage={handleSendMessage} />
      </div>
    </div>
  );
};

export default ChatScreen;
