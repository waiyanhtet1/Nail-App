import { BASE_URL } from "../../constants/baseUrl";

interface Props {
  variant: "send" | "receive";
  message?: string;
  senderName?: string;
  photo?: string; // Add this
  timestamp?: string; // Optional for real timestamp later
}

const ChatMessage = ({
  variant,
  message,
  senderName,
  photo,
  timestamp,
}: Props) => {
  return (
    <div
      className={`flex flex-col ${
        variant === "send" ? "items-end" : "items-start"
      }`}
    >
      <div
        className={`${
          variant === "send" ? "bg-gray text-white" : "bg-white"
        } rounded-xl p-3 text-sm w-[70%] break-words`}
      >
        {/* Conditionally show photo or message */}
        {photo ? (
          <img
            src={`${photo.startsWith("http") ? photo : BASE_URL + photo}`}
            alt="Sent"
            className="rounded-lg max-w-full object-cover"
          />
        ) : (
          message
        )}
      </div>

      <div
        className={`flex items-center gap-3 text-xs mt-1 ${
          variant === "send" ? "justify-end" : ""
        }`}
      >
        <p className="font-semibold">
          {variant === "send" ? senderName : "Barbie's Studio"}
        </p>
        <p className="text-gray">{timestamp || "10:00 AM"}</p>
      </div>
    </div>
  );
};

export default ChatMessage;
