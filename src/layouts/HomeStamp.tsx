import { IonIcon } from "@ionic/react";
import { layersOutline, listOutline, pricetagOutline } from "ionicons/icons";
import Loading from "../components/Loading";
import StampCard from "../components/stamp/StampCard";
import { formatDateString } from "../libs/dateUtils";
import { getLoginUser } from "../libs/userUtils";
import { StampType } from "../types/stampType";

interface Props {
  stampData: StampType;
  isLoading: boolean;
}

const HomeStamp = ({ stampData, isLoading }: Props) => {
  const userInfo = getLoginUser();

  return (
    <div className="overflow-y-scroll no-scrollbar">
      <div className="h-[200px] rounded-b-[2.5rem] bg-primary shadow-lg p-5">
        <div className="flex flex-col gap-3 mt-7 text-secondary ">
          <p className="text-lg font-semibold">Loyalty Card</p>
          <p className="text-sm">Name : {userInfo.username}</p>
          <p className="text-sm">
            Date of Birth : {formatDateString(userInfo.DOB)}
          </p>
        </div>
      </div>

      {/* stamps promotion list */}
      {isLoading ? (
        <Loading />
      ) : (
        <div className="flex flex-col gap-5 mt-5 items-center justify-center mx-5">
          <p className="text-center text-sm text-secondary font-semibold">
            Buy 30,000KS Get 1 stamp
          </p>
          <div className="grid grid-cols-5 gap-x-5 gap-y-7">
            {stampData &&
              stampData.uncollected.map((item) => (
                <StampCard
                  key={item._id}
                  isStamped={item.isDiscountAvailable}
                  stampNumber={item.stampOrder.toString()}
                />
              ))}
          </div>

          {/* promotion discount percentage */}
          <div className="w-full text-secondary text-sm font-semibold">
            {stampData &&
              stampData.uncollected
                .filter((item) => item.isDiscountAvailable)
                .map((stamp) => (
                  <div
                    key={stamp._id}
                    className="bg-white p-2 mb-3 rounded-xl shadow-md"
                  >
                    <p className="mb-3">{stamp.stampName}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col items-center">
                        <IonIcon icon={layersOutline} className="size-5" />
                        <p>{stamp.serviceCategory?.categoryName}</p>
                      </div>
                      <div className="flex flex-col items-center">
                        <IonIcon icon={listOutline} className="size-5" />
                        <p>{stamp.service?.serviceName} service</p>
                      </div>
                      <div className="flex flex-col items-center">
                        <IonIcon icon={pricetagOutline} className="size-5" />
                        <p>{stamp.discount} % off</p>
                      </div>
                    </div>
                  </div>
                ))}
          </div>

          <p className="text-gray mb-5">Thank You For Your Loyalty !</p>
        </div>
      )}
    </div>
  );
};

export default HomeStamp;
