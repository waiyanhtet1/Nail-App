// MessageInput.tsx
import { IonIcon } from "@ionic/react";
import { closeCircleOutline, imageOutline, sendOutline } from "ionicons/icons"; // Import closeCircleOutline for clearing preview
import React, { useEffect, useRef, useState } from "react"; // Import useEffect

interface MessageInputProps {
  onSendMessage: (text: string, imageFile?: File | null) => void;
}

const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage }) => {
  const [message, setMessage] = useState<string>("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null); // New state for image preview URL
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Effect to create and revoke object URL for image preview
  useEffect(() => {
    if (selectedImage) {
      const objectUrl = URL.createObjectURL(selectedImage);
      setImagePreviewUrl(objectUrl);

      // Clean up the object URL when the component unmounts or selectedImage changes
      return () => {
        URL.revokeObjectURL(objectUrl);
      };
    } else {
      setImagePreviewUrl(null); // Clear preview if no image is selected
    }
  }, [selectedImage]); // Re-run when selectedImage changes

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (message.trim() || selectedImage) {
      onSendMessage(message, selectedImage);
      setMessage("");
      setSelectedImage(null); // Clear selected image
      // imagePreviewUrl will be cleared by the useEffect due to setSelectedImage(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""; // Clear the file input visually
      }
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(e.target.files[0]);
    } else {
      setSelectedImage(null);
    }
  };

  const handleImageButtonClick = () => {
    fileInputRef.current?.click();
  };

  const clearImageSelection = () => {
    setSelectedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Clear the file input visually
    }
  };

  return (
    <form
      className="flex flex-col mb-5 bg-white rounded-xl p-3"
      onSubmit={handleSubmit}
    >
      {/* Hidden file input */}
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleImageChange}
      />

      {imagePreviewUrl && (
        <div className="relative mb-3 self-center">
          <img
            src={imagePreviewUrl}
            alt="Image preview"
            className="max-h-32 rounded-lg object-contain border border-gray-300"
          />
          <button
            type="button"
            onClick={clearImageSelection}
            className="absolute top-1 right-1 bg-white rounded-full p-0.5 shadow-md"
            aria-label="Clear image selection"
          >
            <IonIcon
              icon={closeCircleOutline}
              className="text-red-500 w-5 h-5"
            />
          </button>
        </div>
      )}

      <div className="flex w-full">
        <input
          type="text"
          value={message}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setMessage(e.target.value)
          }
          placeholder={
            selectedImage ? "Add a caption..." : "Type your message..."
          }
          className="flex-grow px-5 py-2 text-sm rounded-full focus:outline-none mr-3 border border-gray-300"
        />

        <button
          type="button"
          onClick={handleImageButtonClick}
          className="px-4 py-2 rounded-full font-semibold"
        >
          <IonIcon icon={imageOutline} className="size-5" />
        </button>
        <button
          type="submit"
          className="ml-2 px-4 py-2 rounded-full font-semibold bg-blue-500 text-white" // Added some basic styling for visibility
          disabled={!message.trim() && !selectedImage}
        >
          <IonIcon icon={sendOutline} className="size-5" />
        </button>
      </div>
    </form>
  );
};

export default MessageInput;
