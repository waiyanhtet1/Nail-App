// ChatScreen.tsx
import { IonIcon } from "@ionic/react";
import { arrowBack } from "ionicons/icons";
import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  createChannel,
  editMessage,
  getStreamMessages,
  sendMessage,
} from "../../libs/api";
import { getLoginUser } from "../../libs/userUtils";
import { Message } from "../../types/types";
import EditMessageInput from "./EditMessageInput";
import MessageInput from "./MessageInput";
import MessageList from "./MessageList";

// IMPORTANT: Ensure your REACT_APP_API_BASE_URL is set in your .env file
// e.g., REACT_APP_API_BASE_URL=http://localhost:3000

const ChatScreen: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [channelId, setChannelId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditModeOpen, setIsEditModeOpen] = useState("");
  const [messageToEditContent, setMessageToEditContent] = useState("");
  const [selectedMessageId, setSelectedMessageId] = useState("");
  const userInfo = getLoginUser();
  const navigate = useNavigate();

  const USER_ID: string = userInfo._id;

  // --- 1. Channel Management (Create Channel Once, Fetch ID) ---
  useEffect(() => {
    const initializeChannel = async () => {
      try {
        setIsLoading(true);
        setError(null);

        let channelIdentifier = null;

        const storedChannelId = localStorage.getItem("chatChannelId");
        if (storedChannelId) {
          channelIdentifier = storedChannelId;
          console.log("Channel ID from localStorage:", channelIdentifier);
        }

        if (!channelIdentifier && userInfo && userInfo.channelId) {
          channelIdentifier = userInfo.channelId;
          console.log("Channel ID from userInfo:", channelIdentifier);

          localStorage.setItem("chatChannelId", channelIdentifier);
        }

        if (!channelIdentifier) {
          console.log("No existing channel ID found. Creating new channel...");

          const response = await createChannel(USER_ID);
          channelIdentifier = response.channelId;
          console.log("New channel created:", channelIdentifier);
          localStorage.setItem("chatChannelId", channelIdentifier);
        }

        // Set the determined channel ID to state
        setChannelId(channelIdentifier);
      } catch (err) {
        console.error("Error initializing channel:", err);
        setError("Failed to initialize chat channel. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    initializeChannel();
  }, [userInfo]);

  useEffect(() => {
    if (!channelId) return;

    const fetchMessages = async () => {
      try {
        const response = await getStreamMessages(channelId);
        const newMessages: Message[] = response.data;
        setMessages(newMessages);
      } catch (error) {
        console.error("Polling error:", error);
        setError("Error fetching messages.");
      }
    };

    fetchMessages();
    const intervalId = setInterval(fetchMessages, 3000);

    return () => {
      clearInterval(intervalId);
    };
  }, [channelId]);

  // --- 3. Send Message Functionality (POST /stream/send-message) ---
  const handleSendMessage = useCallback(
    async (text: string, imageFile?: File | null) => {
      // Updated function signature
      if ((!text.trim() && !imageFile) || !channelId) return;

      const optimisticMessage: Message = {
        channelId: channelId,
        userId: USER_ID,
        text: text,
        created_at: new Date().toISOString(),
        id: `temp-${Date.now()}`,
        isOptimistic: true,
        // If you want to show a preview of the image, you'd add a local URL here
        // imageUrl: imageFile ? URL.createObjectURL(imageFile) : undefined,
      };

      setMessages((prevMessages) => [...prevMessages, optimisticMessage]);

      try {
        // Prepare FormData for sending text and image
        const formData = new FormData();
        formData.append("channelId", channelId);
        formData.append("userId", USER_ID);
        if (text.trim()) {
          formData.append("text", text);
        }
        if (imageFile) {
          formData.append("image", imageFile); // 'image' should match the field name on your server
        }

        // Pass FormData directly to the sendMessage function
        // You'll need to update your sendMessage API function to accept FormData
        await sendMessage(formData);

        // Revoke the object URL if you were creating one for optimistic display
        // if (optimisticMessage.imageUrl) {
        //   URL.revokeObjectURL(optimisticMessage.imageUrl);
        // }
      } catch (err) {
        console.error("Error sending message:", err);
        setError("Failed to send message. Please try again.");
        setMessages((prevMessages) =>
          prevMessages.filter((msg) => msg.id !== optimisticMessage.id)
        );
      }
    },
    [channelId, USER_ID]
  );

  // --- New: Handle Edit Message Functionality ---
  const handleEditMessage = useCallback(
    async (newText: string) => {
      const messageId = selectedMessageId;
      if (!newText.trim() || !messageId) return;

      // Optimistic UI update for editing
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.id === messageId
            ? { ...msg, text: newText, isOptimistic: true }
            : msg
        )
      );

      console.log(messageId);
      try {
        await editMessage(USER_ID, messageId, newText);
        // The polling mechanism will eventually fetch the updated message from the server.
      } catch (err) {
        console.error("Error editing message:", err);
        setError("Failed to edit message. Please try again.");
      } finally {
        setIsEditModeOpen("");
        setMessageToEditContent("");
      }
    },
    [USER_ID, selectedMessageId]
  );

  // Function to set edit mode and populate input with current message text
  const openEditMode = useCallback((messageId: string, messageText: string) => {
    // Updated to accept messageText directly
    setIsEditModeOpen(messageId); // This now holds the messageId
    setMessageToEditContent(messageText); // Set the initial message text
    setSelectedMessageId(messageId); // Ensure selectedMessageId is set
  }, []);

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
      <div className="fixed top-0 left-0 right-0 z-10 px-5 py-5">
        <div className="flex items-center">
          <IonIcon
            icon={arrowBack}
            className="w-5 h-5"
            onClick={() => navigate("/")}
          />
          <div className="flex justify-center w-full font-bold text-lg">
            <p className="text-gray-800">Chat with Barbie’s Studio</p>
          </div>
        </div>
        <p className="text-center text-xs text-secondary mt-1">online</p>
      </div>

      <div className="flex-1 mt-[80px] mb-[80px] overflow-y-auto px-5">
        <MessageList
          messages={messages}
          currentUserId={USER_ID}
          // Pass the new openEditMode function, ensuring it's properly typed
          setIsEditModeOpen={
            openEditMode as (messageId: string, messageText: string) => void
          }
        />
      </div>

      <div className="fixed bottom-0 left-0 right-0  z-10 px-5 py-3">
        {isEditModeOpen.length > 0 ? (
          <EditMessageInput
            isEditModeOpen={isEditModeOpen}
            setIsEditModeOpen={(id: string) => setIsEditModeOpen(id)}
            onEditMessage={handleEditMessage}
            initialMessageText={messageToEditContent}
          />
        ) : (
          <MessageInput onSendMessage={handleSendMessage} />
        )}
      </div>
    </div>
  );
};

export default ChatScreen;
