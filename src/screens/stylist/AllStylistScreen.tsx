import { IonIcon } from "@ionic/react";
import { arrowBackOutline } from "ionicons/icons";
import { useNavigate } from "react-router-dom";
import StylistCard from "../../components/cards/StylistCard";

const AllStylistScreen = () => {
  const navigate = useNavigate();

  return (
    <>
      <div className="h-max rounded-b-[2.5rem] bg-primary shadow-lg p-5">
        <div className="flex items-center gap-3 mt-10">
          {/* back and title */}
          <IonIcon
            icon={arrowBackOutline}
            className="size-6"
            onClick={() => navigate(-1)}
          />
          <p className="text-secondary font-bold">Nail Artists</p>
        </div>
      </div>

      <div className="mx-5 md:mx-20 overflow-y-scroll h-[calc(100vh-110px)] no-scrollbar">
        <p className="font-semibold text-secondary text-xl my-5">
          Nail Artists <span className="text-red-800">(10)</span>
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-5 md:place-self-center">
          {Array.from({ length: 10 }).map((_, index) => (
            <StylistCard key={index} name={`Ester ${index + 1}`} />
          ))}
        </div>
      </div>
    </>
  );
};

export default AllStylistScreen;
