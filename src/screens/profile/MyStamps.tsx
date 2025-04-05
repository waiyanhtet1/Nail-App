import { IonIcon } from "@ionic/react";
import { arrowBackOutline } from "ionicons/icons";
import { useNavigate } from "react-router-dom";
import StampCard from "../../components/stamp/StampCard";

const MyStamps = () => {
  const navigate = useNavigate();

  return (
    <>
      <div className="h-[200px] rounded-b-[2.5rem] bg-primary shadow-lg p-5">
        <div className="flex items-center">
          {/* back and title */}
          <IonIcon
            icon={arrowBackOutline}
            className="size-6"
            onClick={() => navigate(-1)}
          />
          <p className="text-secondary font-bold text-center flex justify-center w-full">
            My Stamps
          </p>
        </div>

        <div className="flex flex-col gap-3 mt-7 text-secondary ">
          <p className="text-lg font-semibold">Loyalty Card</p>
          <p className="text-sm">Name : Su Su</p>
          <p className="text-sm">Date of Birth : 08.07.1992</p>
        </div>
      </div>

      {/* stamps promotion list */}
      <div className="flex flex-col gap-5 mt-5 items-center justify-center mx-5">
        <p className="text-center text-sm text-secondary font-semibold">
          Buy 30,000KS Get 1 stamp
        </p>
        <div className="grid grid-cols-5 gap-x-5 gap-y-7">
          {Array.from({ length: 15 }).map((_, index) => (
            <StampCard
              key={index}
              isStamped={index === 0 ? true : false}
              isRedColor={
                index === 4 || index === 9 || index === 14 ? true : false
              }
              stampNumber={(index + 1).toString()}
            />
          ))}
        </div>

        {/* promotion discount percentage */}
        <div className="self-start text-secondary text-sm font-semibold">
          <p>5 - 10% off</p>
          <p>10 - 50% off</p>
          <p>15 - Free</p>
        </div>

        <p className="text-gray">Thank You For Your Loyalty !</p>
      </div>
    </>
  );
};

export default MyStamps;
