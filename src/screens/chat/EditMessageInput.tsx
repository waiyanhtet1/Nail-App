// EditMessageInput.tsx
import { IonIcon } from "@ionic/react";
import { createOutline } from "ionicons/icons";
import React, { useEffect, useState } from "react";

interface EditMessageInputProps {
  isEditModeOpen: string; // This should ideally be the messageId of the message being edited
  setIsEditModeOpen: (value: string) => void;
  onEditMessage: (text: string) => void; // New prop for editing
  initialMessageText: string; // To pre-populate the input with the current message text
}

const EditMessageInput: React.FC<EditMessageInputProps> = ({
  isEditModeOpen,
  setIsEditModeOpen,
  onEditMessage,
  initialMessageText,
}) => {
  const [message, setMessage] = useState<string>(initialMessageText); // Initialize with existing text

  useEffect(() => {
    setMessage(isEditModeOpen);
  }, [isEditModeOpen]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (message.trim() && isEditModeOpen) {
      // Assuming isEditModeOpen holds the messageId
      onEditMessage(message);
      setMessage("");
      setIsEditModeOpen(""); // Close edit mode after sending
    }
  };

  return (
    <>
      {isEditModeOpen && (
        <div className="flex items-center gap-5 text-xs mb-2">
          <p className="">Edit Message</p>
          <p
            className="text-red-primary cursor-pointer"
            onClick={() => setIsEditModeOpen("")}
          >
            Cancel
          </p>
        </div>
      )}
      <form className="flex mb-5 bg-white rounded-xl" onSubmit={handleSubmit}>
        <input
          type="text"
          defaultValue={message} // Use value for controlled component
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
          <IonIcon icon={createOutline} className="size-5" />
        </button>
      </form>
    </>
  );
};

export default EditMessageInput;
