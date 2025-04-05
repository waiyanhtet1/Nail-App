import { IonIcon } from "@ionic/react";
import { arrowBackOutline, linkOutline, sendOutline } from "ionicons/icons";
import { useNavigate } from "react-router-dom";
import ChatMessage from "../../components/chat/ChatMessage";

const ChattingScreen = () => {
  const navigate = useNavigate();

  return (
    <div className="mt-10 mx-5">
      {/* back and title */}
      <div className="flex items-center">
        <IonIcon
          icon={arrowBackOutline}
          className="size-6"
          onClick={() => navigate(-1)}
        />
        <p className="text-secondary font-bold text-center flex justify-center w-full">
          Chat with Barbie’s Studio
        </p>
      </div>

      <p className="text-xs text-secondary text-center mt-1">online</p>

      {/* chatting message list */}
      <div className="py-5 flex flex-col gap-3 overflow-y-scroll h-[calc(100vh-150px)] no-scrollbar">
        {Array.from({ length: 10 }).map((_, index) => (
          <ChatMessage
            key={index}
            variant={index % 2 === 0 ? "receive" : "send"}
            message={`Hi Nora, I'm Barbie, Your customer
          support bot.How may I help you today? ${index + 1}`}
            senderName={index % 2 === 0 ? "" : "Nora"}
          />
        ))}
      </div>

      {/* send message */}
      <div className="bg-white rounded-xl p-3 flex items-center gap-5">
        <input
          type="text"
          placeholder="Type your text message"
          className="w-full outline-none text-sm"
        />
        <IonIcon icon={linkOutline} className="size-7" />
        <IonIcon icon={sendOutline} className="size-6" />
      </div>
    </div>
  );
};

export default ChattingScreen;
