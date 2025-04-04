import { IonIcon } from "@ionic/react";
import { arrowBackOutline } from "ionicons/icons";
import { useNavigate } from "react-router-dom";
import SegmentButton from "../../../components/SegmentButton";

const MyBookingScreen = () => {
  const navigate = useNavigate();

  return (
    <div className="mt-10">
      {/* back and title */}
      <div className="flex items-center mb-5 mx-5">
        <IonIcon
          icon={arrowBackOutline}
          className="size-6"
          onClick={() => navigate(-1)}
        />
        <p className="text-secondary font-bold text-center flex justify-center w-full">
          My Booking
        </p>
      </div>

      <SegmentButton />
    </div>
  );
};

export default MyBookingScreen;
