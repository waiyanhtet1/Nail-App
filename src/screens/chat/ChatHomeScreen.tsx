import { IonIcon } from "@ionic/react";
import {
  callOutline,
  chatbubbleOutline,
  chevronForwardOutline,
  locationOutline,
  mailOutline,
  timeOutline,
} from "ionicons/icons";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button";

const ChatHomeScreen = () => {
  const navigate = useNavigate();

  return (
    <div className="mt-10">
      <p className="text-center font-semibold text-lg text-secondary">
        Chat with our support team
      </p>

      <div className="flex  flex-col items-center justify-center m-10">
        <p className="text-xl text-secondary font-bold">How can we help you?</p>
        <p className="text-sm mt-5 ">
          We are available 24/7 to help clarity any confusion you have an our
          service and ensure that you have a seamless experience thought the
          process
        </p>

        {/* contact info */}
        <div className="flex flex-col gap-4 mt-5">
          {/* open hour */}
          <div className="flex items-center gap-3">
            <div className="w-[30px] h-[30px] rounded-full bg-gray-fifth flex items-center justify-center p-1">
              <IonIcon icon={timeOutline} className="size-5 text-gray" />
            </div>
            <p className="text-secondary font-semibold text-sm">
              Open Hour : 10 AM - 8 PM
            </p>
          </div>
          {/* location */}
          <div className="flex items-center gap-3">
            <div className="w-[30px] h-[30px] rounded-full bg-gray-fifth flex items-center justify-center p-1">
              <IonIcon icon={locationOutline} className="size-5 text-gray" />
            </div>
            <p className="text-secondary font-semibold text-sm">
              No.275/A, Ground Floor, Red Hill Tower, Pyay Road, Myaynigone Tsp.
            </p>
          </div>
          {/* phone */}
          <div className="flex items-center gap-3">
            <div className="w-[30px] h-[30px] rounded-full bg-gray-fifth flex items-center justify-center p-1">
              <IonIcon icon={callOutline} className="size-5 text-gray" />
            </div>
            <p className="text-secondary font-semibold text-sm">
              09945566776, 09693203213
            </p>
          </div>
          {/* email */}
          <div className="flex items-center gap-3">
            <div className="w-[30px] h-[30px] rounded-full bg-gray-fifth flex items-center justify-center p-1">
              <IonIcon icon={mailOutline} className="size-5 text-gray" />
            </div>
            <p className="text-secondary font-semibold text-sm">
              barbiestudio@gmail.com
            </p>
          </div>
        </div>

        {/* button */}
        <Button
          type="button"
          variant="primary"
          leftIcon={chatbubbleOutline}
          rightIcon={chevronForwardOutline}
          className="mt-10"
          onClick={() => {
            navigate("/chat");
          }}
        >
          Contact Live Chat
        </Button>
      </div>
    </div>
  );
};

export default ChatHomeScreen;
