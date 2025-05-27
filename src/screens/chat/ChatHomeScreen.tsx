import { Browser } from "@capacitor/browser";
import { IonIcon } from "@ionic/react";
import {
  callOutline,
  locationOutline,
  logoFacebook,
  logoInstagram,
  logoTiktok,
  mailOutline,
  timeOutline,
} from "ionicons/icons";

const ChatHomeScreen = () => {
  // const navigate = useNavigate();

  return (
    // <div className="mt-10">
    //   <p className="text-center font-semibold text-lg text-secondary">
    //     Chat with our support team
    //   </p>

    //   <div className="flex  flex-col items-center justify-center m-10">
    //     <p className="text-xl text-secondary font-bold">How can we help you?</p>
    //     <p className="text-sm mt-5 ">
    //       We are available 24/7 to help clarity any confusion you have an our
    //       service and ensure that you have a seamless experience thought the
    //       process
    //     </p>

    //     {/* contact info */}
    //     <div className="flex flex-col gap-4 mt-5">
    //       {/* open hour */}
    //       <div className="flex items-center gap-3">
    //         <div className="w-[30px] h-[30px] rounded-full bg-gray-fifth flex items-center justify-center p-1">
    //           <IonIcon icon={timeOutline} className="size-5 text-gray" />
    //         </div>
    //         <p className="text-secondary font-semibold text-sm">
    //           Open Hour : 10 AM - 8 PM
    //         </p>
    //       </div>
    //       {/* location */}
    //       <div className="flex items-center gap-3">
    //         <div className="w-[30px] h-[30px] rounded-full bg-gray-fifth flex items-center justify-center p-1">
    //           <IonIcon icon={locationOutline} className="size-5 text-gray" />
    //         </div>
    //         <p className="text-secondary font-semibold text-sm">
    //           No.275/A, Ground Floor, Red Hill Tower, Pyay Road, Myaynigone Tsp.
    //         </p>
    //       </div>
    //       {/* phone */}
    //       <div className="flex items-center gap-3">
    //         <div className="w-[30px] h-[30px] rounded-full bg-gray-fifth flex items-center justify-center p-1">
    //           <IonIcon icon={callOutline} className="size-5 text-gray" />
    //         </div>
    //         <p className="text-secondary font-semibold text-sm">
    //           09945566776, 09693203213
    //         </p>
    //       </div>
    //       {/* email */}
    //       <div className="flex items-center gap-3">
    //         <div className="w-[30px] h-[30px] rounded-full bg-gray-fifth flex items-center justify-center p-1">
    //           <IonIcon icon={mailOutline} className="size-5 text-gray" />
    //         </div>
    //         <p className="text-secondary font-semibold text-sm">
    //           barbiestudio@gmail.com
    //         </p>
    //       </div>
    //     </div>

    //     {/* button */}
    //     <Button
    //       type="button"
    //       variant="primary"
    //       leftIcon={chatbubbleOutline}
    //       rightIcon={chevronForwardOutline}
    //       className="mt-10"
    //       onClick={() => {
    //         navigate("/chat");
    //       }}
    //     >
    //       Contact Live Chat
    //     </Button>
    //   </div>
    // </div>

    <div className="mt-15 mx-5">
      <div className="flex items-center gap-3">
        {/* <IonIcon icon={arrowBackOutline} className="size-5" /> */}
        <p className="text-lg font-semibold">Follow Us</p>
      </div>

      {/* open hour */}
      <div className="mt-5 bg-white shadow p-5 rounded-lg flex items-center gap-3">
        <div className="w-[30px] h-[30px] rounded-full bg-primary-second flex items-center justify-center p-1">
          <IonIcon icon={timeOutline} className="size-5 text-gray" />
        </div>
        <p className="text-sm font-semibold">Open Hour : 10 AM - 8 PM </p>
      </div>

      {/* social cards */}
      <div className="grid grid-cols-2 gap-5 mt-5">
        <SocialCard
          name="Facebook"
          icon={logoFacebook}
          onClick={() => {
            Browser.open({
              url: "https://www.facebook.com/barbiesstudio24?mibextid=wwXIfr&mibextid=wwXIfr",
            });
          }}
        />
        <SocialCard
          name="Instagram"
          icon={logoInstagram}
          onClick={() => {
            Browser.open({
              url: "https://www.instagram.com/barbiesstudio24?igsh=MW5hdXhkMzV4NTRiNw==",
            });
          }}
        />
        <SocialCard
          name="Tiktok"
          icon={logoTiktok}
          onClick={() => {
            Browser.open({
              url: "https://www.tiktok.com/@barbies.studio?_t=ZS-8wawDHkkfK6&_r=1",
            });
          }}
        />

        <SocialCard
          name="Map"
          icon={locationOutline}
          onClick={() => {
            Browser.open({
              url: "https://maps.app.goo.gl/vmFGiXTosr1jZTTa9",
            });
          }}
        />
        <SocialCard
          name="Phone"
          icon={callOutline}
          onClick={() => {
            window.location.href = "tel:09945566776";
          }}
        />
        <SocialCard
          name="Mail"
          icon={mailOutline}
          onClick={() => {
            window.location.href = "mailto:barbiestudio@gmail.com";
          }}
        />
      </div>
    </div>
  );
};

export default ChatHomeScreen;

type SocialCardType = {
  icon: string;
  name: string;
  onClick: () => void;
};
const SocialCard = ({ icon, name, onClick }: SocialCardType) => {
  return (
    <div
      className="bg-white shadow p-3 rounded-lg flex flex-col items-center gap-3"
      onClick={onClick}
    >
      <div className="w-[30px] h-[30px] rounded-full bg-primary-second flex items-center justify-center p-1">
        <IonIcon icon={icon} className="size-5 text-gray" />
      </div>
      <p className="text-sm font-semibold">{name}</p>
    </div>
  );
};
