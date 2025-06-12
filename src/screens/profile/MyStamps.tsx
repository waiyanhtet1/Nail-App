import { IonIcon } from "@ionic/react";
import axios from "axios";
import { arrowBackOutline } from "ionicons/icons";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Loading from "../../components/Loading";
import StampCard from "../../components/stamp/StampCard";
import { BASE_URL } from "../../constants/baseUrl";
import { getLoginUser } from "../../libs/userUtils";
import { StampType } from "../../types/stampType";

const MyStamps = () => {
  const navigate = useNavigate();
  const userInfo = getLoginUser();
  const [stampData, setStampData] = useState<StampType>();
  const [isLoading, setIsLoading] = useState(false);

  const getRoyal = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data } = await axios.get(
        `${BASE_URL}/loyalty-stamps/${userInfo._id}`
      );
      setStampData(data);
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  }, [userInfo._id]);

  useEffect(() => {
    getRoyal();
  }, [getRoyal]);

  return (
    <div className="overflow-y-scroll no-scrollbar">
      {/* header */}
      <div className="h-max rounded-b-[2.5rem] bg-primary shadow-lg p-5">
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
          <p className="text-sm">Name : {userInfo.username}</p>
          {/* <p className="text-sm">
            Date of Birth : {formatDateString(userInfo.DOB)}
          </p> */}
        </div>
      </div>

      {isLoading ? (
        <Loading />
      ) : (
        <div className="flex flex-col gap-5 mt-5 items-center justify-center mx-5">
          <p className="text-center text-sm text-secondary font-semibold">
            Buy 60,000KS Get 1 stamp
          </p>

          {/* Sorted stamp grid */}
          <div className="grid grid-cols-5 gap-x-5 gap-y-7">
            {stampData &&
              [...stampData.collected, ...stampData.uncollected]
                .sort((a, b) => a.stampOrder - b.stampOrder)
                .map((item) => {
                  const isCollected = stampData.collected.some(
                    (collectedItem) => collectedItem._id === item._id
                  );

                  const showRed = isCollected;
                  const showImage =
                    (isCollected && item.isDiscountAvailable) ||
                    (!isCollected && item.isDiscountAvailable);

                  return (
                    <StampCard
                      key={item._id}
                      stampNumber={item.stampOrder.toString()}
                      isRedColor={showRed}
                      isStamped={showImage}
                    />
                  );
                })}
          </div>

          {/* Sorted promotions list */}
          <div className="w-full text-secondary text-sm font-semibold">
            {stampData &&
              [...stampData.uncollected]
                .filter((item) => item.isDiscountAvailable)
                .sort((a, b) => a.stampOrder - b.stampOrder)
                .map((stamp) => (
                  // <div
                  //   key={stamp._id}
                  //   className="bg-white p-2 mb-3 rounded-xl shadow-md"
                  // >
                  //   <p className="mb-3">{stamp.stampName}</p>
                  //   <div className="flex items-center justify-between">
                  //     <div className="flex flex-col items-center">
                  //       <IonIcon icon={layersOutline} className="size-5" />
                  //       <p>{stamp.serviceCategory?.categoryName || "N/A"}</p>
                  //     </div>
                  //     <div className="flex flex-col items-center">
                  //       <IonIcon icon={listOutline} className="size-5" />
                  //       <p>{stamp.service?.serviceName || "N/A"} service</p>
                  //     </div>
                  //     <div className="flex flex-col items-center">
                  //       <IonIcon icon={pricetagOutline} className="size-5" />
                  //       <p>{stamp.discount} % off</p>
                  //     </div>
                  //   </div>
                  // </div>
                  <div className="flex items-center gap-3 mb-2" key={stamp._id}>
                    <p>{stamp.stampName}</p> <p>-</p>
                    <p>{stamp.discount} % off</p>
                  </div>
                ))}
          </div>

          <p className="text-gray mb-5">Thank You For Your Loyalty !</p>
        </div>
      )}
    </div>
  );
};

export default MyStamps;
