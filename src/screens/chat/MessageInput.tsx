// MessageInput.tsx
import { IonIcon } from "@ionic/react";
import { sendOutline } from "ionicons/icons";
import React, { useState } from "react";

interface MessageInputProps {
  onSendMessage: (text: string) => void;
}

const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage }) => {
  const [message, setMessage] = useState<string>("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage("");
    }
  };

  return (
    <form className="flex mb-5 bg-white rounded-xl" onSubmit={handleSubmit}>
      <input
        type="text"
        value={message}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setMessage(e.target.value)
        }
        placeholder="Type your message..."
        className="flex-grow px-5 py-2 text-sm rounded-full focus:outline-none mr-3"
      />
      <button
        type="submit"
        className="px-6 py-2 rounded-full font-semibold"
        disabled={!message.trim()}
      >
        <IonIcon icon={sendOutline} className="size-5" />
      </button>
    </form>
  );
};

export default MessageInput;
