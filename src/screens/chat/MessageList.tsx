// MessageList.tsx
import { IonIcon } from "@ionic/react";
import { createOutline, trashBinOutline } from "ionicons/icons";
import React, { useRef, useState } from "react";
import { formatTimeString } from "../../libs/dateUtils";
import { getLoginUser } from "../../libs/userUtils";
import { Message } from "../../types/types";
import ChatDeleteSlider from "./ChatDeleteSlider";

interface MessageListProps {
  messages: Message[];
  currentUserId: string;
  setIsEditModeOpen: (messageId: string, value: string) => void;
}

const MessageList: React.FC<MessageListProps> = ({
  messages,
  setIsEditModeOpen,
  currentUserId,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const userInfo = getLoginUser();

  const [chatConfirmOpen, setChatConfirmOpen] = useState(false);
  const [selectedMessageId, setSelectedMessageId] = useState("");

  return (
    <div className="">
      {messages.length === 0 ? (
        <div className="text-center text-gray-600 mt-12">Start chatting!</div>
      ) : (
        messages.map((msg) => (
          <>
            <div className="relative">
              {msg.attachments && msg.attachments.length > 0 ? (
                // image display
                <div
                  key={msg.id}
                  className={`mb-10 p-3 rounded-lg max-w-[70%] text-sm break-words
              ${
                msg.user?.id === currentUserId
                  ? "ml-auto" // Sent message style
                  : "mr-auto" // Received message style
              }`}
                >
                  <img src={msg.attachments[0].image_url} alt="" />
                </div>
              ) : (
                // message text display
                <div
                  key={msg.id}
                  className={`mb-10 p-3 rounded-lg max-w-[70%] text-sm break-words
              ${
                msg.user?.id === currentUserId
                  ? "ml-auto bg-gray text-white shadow-sm" // Sent message style
                  : "mr-auto bg-white text-secondary shadow-sm" // Received message style
              }`}
                >
                  <div className="text-sm">{msg.text}</div>

                  {msg.user?.id === currentUserId && msg.isOptimistic && (
                    <span className="text-right text-xs italic text-gray-500 mt-1">
                      Sending...
                    </span>
                  )}
                </div>
              )}

              {/* action buttons */}
              {msg.user?.id === currentUserId &&
                msg.text !== "This message was deleted." && (
                  <div className="absolute bottom-[-20px] left-[100px] flex items-center gap-5">
                    {msg.attachments && msg.attachments.length <= 0 && (
                      <IonIcon
                        icon={createOutline}
                        className="size-[20px]"
                        onClick={() => setIsEditModeOpen(msg.id, msg.text)}
                      />
                    )}
                    <IonIcon
                      icon={trashBinOutline}
                      className="size-[20px]"
                      onClick={() => {
                        setChatConfirmOpen(true);
                        setSelectedMessageId(msg.id);
                      }}
                    />
                  </div>
                )}

              <div
                className={`absolute bottom-[-20px] ${
                  msg.user?.id === currentUserId ? "right-0" : "left-0"
                } text-xs flex items-center gap-2`}
              >
                <p className="font-semibold">
                  {msg.user?.id === currentUserId
                    ? userInfo.username
                    : "Barbie's Studio"}
                </p>
                <p>{formatTimeString(msg.created_at)}</p>
              </div>
            </div>
          </>
        ))
      )}
      <div ref={messagesEndRef} />

      {chatConfirmOpen && (
        <ChatDeleteSlider
          messageId={selectedMessageId}
          isOpen={chatConfirmOpen}
          setOpen={setChatConfirmOpen}
        />
      )}
    </div>
  );
};

export default MessageList;
