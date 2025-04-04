import { IonIcon } from "@ionic/react";
import { arrowBackOutline } from "ionicons/icons";
import { useNavigate } from "react-router-dom";

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
    </div>
  );
};

export default ChattingScreen;
