interface Props {
  variant: "send" | "receive";
  message: string;
  senderName?: string;
}

const ChatMessage = ({ variant, message, senderName }: Props) => {
  return (
    <div className={`flex flex-col ${variant === "send" && "items-end"}`}>
      <div
        className={`${
          variant === "send" ? "bg-gray text-white" : "bg-white"
        } rounded-xl p-3 text-sm w-[70%]`}
      >
        {message}
      </div>
      <div
        className={`${
          variant === "send" && "justify-end"
        } flex items-center gap-3 text-xs mt-1`}
      >
        <p className="font-semibold">
          {variant === "send" ? senderName : "Barbie's Studio"}
        </p>
        <p className=" text-gray">10:00 AM</p>
      </div>
    </div>
  );
};

export default ChatMessage;
