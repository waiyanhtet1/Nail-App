import { IonIcon } from "@ionic/react";
import axios from "axios";
import { arrowBackOutline } from "ionicons/icons";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ActionButton from "../components/ActionButton";
import Input from "../components/Input";
import Loading from "../components/Loading";
import { BASE_URL } from "../constants/baseUrl";
import { useAppSelector } from "../redux/hook";
import SelectArtistSection from "../sections/bookingSections/SelectArtistSection";
import { ServiceDetailType } from "../types/types";

const AddBookingScreen = () => {
  const { selectedCategory, selectedServiceId } = useAppSelector(
    (state) => state.booking
  );
  const navigate = useNavigate();
  const [serviceDetail, setServiceDetail] = useState<ServiceDetailType>();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedArtistId, setSelectedArtistId] = useState<string>("");
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("");

  useEffect(() => {
    async function getBookingDetail() {
      if (selectedServiceId && selectedCategory?.id) {
        setIsLoading(true);
        try {
          const { data } = await axios.get(
            `${BASE_URL}/booking/${selectedServiceId}/${selectedCategory?.id}`
          );
          console.log(data);
          setServiceDetail(data);
        } catch (error) {
          console.log(error);
        }
        setIsLoading(false);
      }
    }

    getBookingDetail();
  }, [selectedCategory?.id, selectedServiceId]);

  return (
    <div>
      {/* header */}
      <div className="h-[150px] rounded-b-[2.5rem] bg-primary shadow-lg p-5">
        <div className="flex items-center">
          {/* back and title */}
          <IonIcon
            icon={arrowBackOutline}
            className="size-6"
            onClick={() => navigate(-1)}
          />
          <p className="text-secondary font-bold text-center flex justify-center w-full">
            Choose Date & Time
          </p>
        </div>
      </div>

      {isLoading ? (
        <Loading />
      ) : (
        <div className="flex flex-col gap-5 m-5">
          {/* artist list */}
          <p className="text-center text-secondary text-lg font-semibold">
            Choose Available Artists
          </p>
          <div className="flex items-center overflow-x-scroll no-scrollbar">
            {serviceDetail?.stylists &&
              serviceDetail.stylists.map((item) => (
                <SelectArtistSection
                  key={item._id}
                  stylist={item}
                  onClick={() => setSelectedArtistId(item._id)}
                  selectedArtistId={selectedArtistId as string}
                />
              ))}
          </div>

          {/* choose slot list */}
          <p className="text-center text-secondary text-lg font-semibold">
            Choose Available Slots
          </p>
          <div className="grid grid-cols-2 gap-3">
            {serviceDetail?.timeSlots &&
              serviceDetail.timeSlots.map((item, index) => (
                <ActionButton
                  key={index}
                  type="button"
                  variant={
                    item.timeSlot === selectedTimeSlot ? "primary" : "outline"
                  }
                  size="sm"
                  onClick={() => setSelectedTimeSlot(item.timeSlot)}
                >
                  {item.timeSlot}
                </ActionButton>
              ))}
          </div>

          {/* person count input */}
          <div className="flex items-center gap-3">
            <Input label="Person:" type="text" />
          </div>
        </div>
      )}
    </div>
  );
};

export default AddBookingScreen;
