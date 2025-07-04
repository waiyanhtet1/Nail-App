// MessageList.tsx
import React, { useRef } from "react";
import { formatTimeString } from "../../libs/dateUtils";
import { getLoginUser } from "../../libs/userUtils";
import { Message } from "../../types/types";

interface MessageListProps {
  messages: Message[];
  currentUserId: string;
}

const MessageList: React.FC<MessageListProps> = ({
  messages,
  currentUserId,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const userInfo = getLoginUser();

  // useEffect(() => {
  //   messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  // }, [messages]);

  return (
    <div className="">
      {messages.length === 0 ? (
        <div className="text-center text-gray-600 mt-12">Start chatting!</div>
      ) : (
        messages.map((msg) => (
          <div className="relative">
            <div
              key={msg.id}
              className={`mb-10 p-3 rounded-lg max-w-[70%] text-sm break-words
              ${
                msg.user?.id === currentUserId
                  ? "ml-auto bg-gray text-white shadow-sm" // Sent message style
                  : "mr-auto bg-white text-secondary shadow-sm" // Received message style
              }`}
            >
              {/* <div className="font-semibold text-xs mb-1">
              {msg.user?.id === currentUserId ? "You" : msg.userId}:
            </div> */}
              <div className="text-sm">{msg.text}</div>
              {/* <div className="text-right text-xs text-gray-500 mt-1">
              {new Date(msg.created_at).toLocaleTimeString()}
            </div> */}
              {msg.isOptimistic && (
                <span className="text-right text-xs italic text-gray-500 mt-1">
                  Sending...
                </span>
              )}
            </div>
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
        ))
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;
