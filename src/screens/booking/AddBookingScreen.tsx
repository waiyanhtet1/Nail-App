import { IonIcon } from "@ionic/react";
import axios, { isAxiosError } from "axios";
import { arrowBackOutline } from "ionicons/icons";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ActionButton from "../../components/ActionButton";
import DateSelectBottomSheet from "../../components/bottomSheets/DateSelectBottomSheet";
import Button from "../../components/Button";
import Loading from "../../components/Loading";
import { BASE_URL } from "../../constants/baseUrl";
import { formatDateString } from "../../libs/dateUtils";
import { getLoginUser } from "../../libs/userUtils";
import { useAppDispatch, useAppSelector } from "../../redux/hook";
import { setBookingId } from "../../redux/slices/bookingSlice";
import SelectArtistSection from "../../sections/bookingSections/SelectArtistSection";
import { ServiceDetailType } from "../../types/types";

const AddBookingScreen = () => {
  const { selectedCategory, selectedServiceId } = useAppSelector(
    (state) => state.booking
  );
  const navigate = useNavigate();
  const [serviceDetail, setServiceDetail] = useState<ServiceDetailType>();
  const [isLoading, setIsLoading] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [selectedArtistId, setSelectedArtistId] = useState<string>("");
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("");
  const [personCount, setPersonCount] = useState(1);
  const [error, setError] = useState("");
  const [isDateSheetOpen, setIsDateSheetOpen] = useState(false);
  const [selectedDateInput, setSelectedDateInput] = useState("");
  const userInfo = getLoginUser();
  const dispatch = useAppDispatch();

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

  async function addOnBooking() {
    // check if button disabled or not
    if (
      selectedArtistId === "" ||
      selectedTimeSlot === "" ||
      selectedDateInput === ""
    ) {
      setError("Require to select or fill fields");
      return;
    } else if (personCount <= 0) {
      setError("Person Count should be at least 1");
      return;
    }
    // create booking
    setError("");
    setCreateLoading(true);
    try {
      const response = await axios.post(`${BASE_URL}/booking`, {
        serviceId: selectedServiceId,
        customerUserId: userInfo.user._id,
        date: selectedDateInput,
        bookingData: [
          {
            personCount,
            stylistId: selectedArtistId,
            timeSlot: selectedTimeSlot,
          },
        ],
      });
      console.log(response);
      dispatch(setBookingId(response.data.bookingId));
      navigate("/confirm-booking");
    } catch (error) {
      console.log(error);
      if (error && isAxiosError(error)) {
        setError(error.response?.data.message);
      } else {
        setError("Fail to book on appointment");
      }
    }
    setCreateLoading(false);
  }

  // console.log("here", selectedDateInput);

  return (
    <div className="mt-10 mx-5">
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

      {isLoading ? (
        <Loading />
      ) : (
        <div className="flex flex-col gap-5 m-5 overflow-y-scroll h-[calc(100vh-110px)] no-scrollbar">
          {/* choose date button */}
          <div
            className="bg-primary p-3 rounded-xl shadow-md text-secondary font-semibold text-center"
            onClick={() => setIsDateSheetOpen(true)}
          >
            {selectedDateInput === ""
              ? "Select Choose Date"
              : formatDateString(selectedDateInput)}
          </div>

          {/* artist list */}
          <p className="text-center text-secondary text-lg font-semibold">
            Choose Available Artists
          </p>
          <div className="flex items-center">
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
                  className="rounded-lg"
                  onClick={() => setSelectedTimeSlot(item.timeSlot)}
                >
                  {item.timeSlot}
                </ActionButton>
              ))}
          </div>

          {/* person count input */}
          <div className="flex items-center gap-3 w-[100px]">
            <p>Person:</p>
            <input
              type="text"
              className="bg-white p-2 rounded-lg outline-none w-[70px] text-center"
              defaultValue={personCount.toString()}
              onChange={(e) => setPersonCount(Number(e.target.value))}
            />
          </div>

          {error !== "" && <p className="text-sm text-red-500">{error}</p>}

          {createLoading ? (
            <Loading />
          ) : (
            <Button variant="primary" type="button" onClick={addOnBooking}>
              Book on Appointment
            </Button>
          )}
        </div>
      )}
      {isDateSheetOpen && (
        <DateSelectBottomSheet
          isOpen={isDateSheetOpen}
          setOpen={setIsDateSheetOpen}
          selectedDateInput={selectedDateInput}
          setSelectedDateInput={setSelectedDateInput}
        />
      )}
    </div>
  );
};

export default AddBookingScreen;
