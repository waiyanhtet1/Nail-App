import { IonIcon } from "@ionic/react";
import axios from "axios";
import { arrowBackOutline } from "ionicons/icons";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ActionButton from "../../components/ActionButton";
import Button from "../../components/Button";
import ChooseDateInput from "../../components/chooseDate/ChooseDateInput";
import { BASE_URL } from "../../constants/baseUrl";
import { daysToNumbers } from "../../libs/dateUtils";
import { getLoginUser } from "../../libs/userUtils";
import { useAppDispatch, useAppSelector } from "../../redux/hook";
import { setSelectedBooking } from "../../redux/slices/bookingSlice";
import {
  initializePersonArray,
  resetPersonCount,
  setStylistDispatch,
  setTimeSlotDispatch,
} from "../../redux/slices/personCountSlice";
import SelectArtistSection from "../../sections/bookingSections/SelectArtistSection";
import { ServiceDetailType, StyleListType } from "../../types/types";

const AddBookingScreen = () => {
  const { selectedCategory, selectedService } = useAppSelector(
    (state) => state.booking
  );
  const pCount = useAppSelector((state) => state.personCount);

  const navigate = useNavigate();
  const [serviceDetail, setServiceDetail] = useState<ServiceDetailType>();
  const [selectedArtist, setSelectedArtist] = useState<StyleListType | null>(
    null
  );
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("");
  const [personCount, setPersonCount] = useState(1);
  const [error, setError] = useState("");
  const [selectedDateInput, setSelectedDateInput] = useState("");
  const [closingDays, setClosingDays] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const userInfo = getLoginUser();
  const dispatch = useAppDispatch();

  useEffect(() => {
    async function getBookingDetail() {
      if (selectedService && selectedCategory?.id) {
        setIsLoading(true);
        try {
          const { data } = await axios.get(
            `${BASE_URL}/booking/${selectedService._id}/${selectedCategory?.id}?date=${selectedDateInput}`
          );
          setServiceDetail(data);
          setClosingDays(daysToNumbers(data.businessConfig.closingDays));
        } catch (error) {
          console.log(error);
        }
        setIsLoading(false);
      }
    }
    getBookingDetail();

    // add array length of personCount
    dispatch(initializePersonArray(personCount));
  }, [
    selectedCategory?.id,
    selectedService,
    dispatch,
    personCount,
    selectedDateInput,
  ]);

  async function addOnBooking() {
    // check if button disabled or not
    if (
      selectedArtist === null ||
      selectedTimeSlot === "" ||
      selectedDateInput === ""
    ) {
      setError("Require to select or fill fields");
      return;
    } else if (personCount <= 0) {
      setError("Person Count should be at least 1");
      return;
    }
    setError("");

    const convertedPCountData = pCount.map((item) => ({
      personCount: 1,
      stylistId: item.stylistId,
      timeSlot: item.timeSlot,
    }));

    dispatch(
      setSelectedBooking({
        customerUserId: userInfo._id,
        date: selectedDateInput,
        bookingData: convertedPCountData,
      })
    );
    navigate("/confirm-booking");
  }

  return (
    <div>
      <div className="h-[200px] rounded-b-[2.5rem] bg-primary shadow-lg p-5">
        <div className="flex items-center">
          {/* back and title */}
          <IonIcon
            icon={arrowBackOutline}
            className="size-6"
            onClick={() => {
              navigate(-1);
              dispatch(resetPersonCount());
            }}
          />
          <p className="text-secondary font-bold text-center flex justify-center w-full">
            Choose Date & Time
          </p>
        </div>

        {/* info */}
        <div className="mt-8">
          <ChooseDateInput
            closingDays={closingDays}
            onDateChange={(dateString: string) =>
              setSelectedDateInput(dateString)
            }
          />
        </div>
      </div>

      {isLoading && <p className="text-center">Loading Info...</p>}
      <div className="flex flex-col gap-5 m-5 overflow-y-scroll h-[calc(100vh-250px)] no-scrollbar">
        {/* artist list */}
        <p className="text-secondary text-lg font-semibold">
          Choose Nail Artists
        </p>
        <div className="flex items-center">
          {serviceDetail?.stylists &&
            serviceDetail.stylists.map((item) => (
              <SelectArtistSection
                key={item._id}
                stylist={item}
                onClick={() => {
                  setSelectedArtist(item);
                  dispatch(setStylistDispatch(item._id));
                }}
              />
            ))}
        </div>

        {/* choose slot list */}
        <p className="text-secondary text-lg font-semibold">
          Choose Available Slots
        </p>
        <div className="grid grid-cols-2 gap-3">
          {serviceDetail?.timeSlots &&
            serviceDetail.timeSlots.map((slot, index) => {
              const personsForSlot = pCount.filter(
                (p) => p.timeSlot === slot.timeSlot
              );

              const currentPerson = personsForSlot.find(
                (p) => p.stylistId === selectedArtist?._id
              );

              const isSelected = Boolean(currentPerson);

              return (
                <div className="flex flex-col" key={index}>
                  <ActionButton
                    type="button"
                    variant={isSelected ? "primary" : "outline"}
                    size="sm"
                    className="rounded-lg"
                    onClick={() => {
                      if (slot.timeSlotStatus === "available") {
                        setSelectedTimeSlot(slot.timeSlot);
                        dispatch(
                          setTimeSlotDispatch({
                            stylistId: selectedArtist?._id as string,
                            timeSlot: slot.timeSlot,
                          })
                        );
                      }
                    }}
                    disabled={slot.timeSlotStatus !== "available"}
                  >
                    {slot.timeSlot.split("-")[0]}
                  </ActionButton>

                  {/* Show all assigned person numbers */}
                  {personsForSlot.length > 0 && (
                    <div className="text-xs text-center mt-1 space-y-1">
                      {personsForSlot.map((p) => (
                        <p key={p.id}>Person {p.id}</p>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
        </div>

        {/* person count input */}
        <div className="flex items-center gap-3 w-[100px]">
          <p>Person:</p>
          {/* <input
              type="text"
              className="bg-white p-2 rounded-lg outline-none w-[70px] text-center"
              defaultValue={personCount.toString()}
              onChange={(e) => {
                setPersonCount(Number(e.target.value));
              }}
            /> */}
          <div className="flex items-center gap-3">
            <p
              className="bg-white w-[40px] h-[40px] flex items-center justify-center rounded-full text-xl"
              onClick={() => {
                if (personCount > 1) setPersonCount((prev) => prev - 1);
              }}
            >
              -
            </p>
            <p className="text-lg font-semibold">{personCount}</p>
            <p
              className="bg-white w-[40px] h-[40px] flex items-center justify-center rounded-full text-xl"
              onClick={() => setPersonCount((prev) => prev + 1)}
            >
              +
            </p>
          </div>
        </div>

        {error !== "" && <p className="text-sm text-red-500">{error}</p>}

        <Button variant="primary" type="button" onClick={addOnBooking}>
          Book on Appointment
        </Button>
      </div>
    </div>
  );
};

export default AddBookingScreen;
