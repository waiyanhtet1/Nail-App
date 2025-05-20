import axios, { isAxiosError } from "axios";
import { cashOutline } from "ionicons/icons";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import ActionButton from "../../components/ActionButton";
import BottomSheetModal from "../../components/bottomSheets/BottomSheetModal";
import ErrorMessageSlider from "../../components/bottomSheets/ErrorMessageSlider";
import Button from "../../components/Button";
import Loading from "../../components/Loading";
import { BASE_URL } from "../../constants/baseUrl";
import { formatDateString } from "../../libs/dateUtils";
import { useAppDispatch, useAppSelector } from "../../redux/hook";
import { setBookingId } from "../../redux/slices/bookingSlice";

const paymentsList = [
  {
    id: 1,
    name: "Cash",
    icon: cashOutline,
  },
  // {
  //   id: 2,
  //   name: "Debit Card",
  //   icon: cardOutline,
  // },
  // {
  //   id: 3,
  //   name: "Digital Pay",
  //   icon: qrCodeOutline,
  // },
];

const BookingConfirmScreen = () => {
  const { selectedBooking, selectedService } = useAppSelector(
    (state) => state.booking
  );
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(
    paymentsList[0].id
  );
  const [sheetModalOpen, setSheetModalOpen] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [stylistNames, setStylistNames] = useState<string[]>([]);
  const [errorMessageSliderOpen, setErrorMessageSliderOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleAddBooking = async () => {
    setCreateLoading(true);
    try {
      const response = await axios.post(`${BASE_URL}/booking`, {
        serviceId: selectedService?._id,
        customerUserId: selectedBooking?.customerUserId,
        date: selectedBooking?.date,
        bookingData: selectedBooking?.bookingData,
      });
      console.log(response);
      dispatch(setBookingId(response.data.bookingId));
      setSheetModalOpen(true);
    } catch (error) {
      console.log(error);
      if (error && isAxiosError(error)) {
        // toast.error(error.response?.data.message);
        setErrorMessageSliderOpen(true);
        setErrorMessage(error.response?.data.message);
      } else {
        toast.error("Fail to book on appointment");
        navigate(-1);
      }
    }
    setCreateLoading(false);
  };

  useEffect(() => {
    const fetchStylists = async () => {
      if (!selectedBooking?.bookingData) return;

      try {
        const promises = selectedBooking.bookingData.map((item) =>
          axios.get(`${BASE_URL}/admin/stylists/${item.stylistId}`)
        );

        const responses = await Promise.all(promises);
        const names = responses.map((res) => res.data.stylistName);
        setStylistNames(names);
      } catch (err) {
        console.error("Error fetching stylists:", err);
      }
    };

    fetchStylists();
  }, [selectedBooking?.bookingData]);

  return (
    <div className="mt-10 mx-5">
      <p className="text-xl font-bold text-secondary">Booking Detail</p>
      <hr className="mt-3 mb-5 text-gray-fourth" />

      {/* booking info */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <p>Booking Date:</p>
          <p>{formatDateString(selectedBooking?.date as string)}</p>
        </div>

        <div className="flex items-center justify-between">
          <p>Booking Time:</p>
          <div className="flex items-center">
            <p>
              {selectedBooking?.bookingData
                .map((item) => item.timeSlot.split("-")[0])
                .join(", ")}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <p>Number of Person:</p>
          <p>{selectedBooking?.bookingData.length}</p>
        </div>

        <div className="flex items-center justify-between">
          <p>Stylist Name:</p>
          <div className="flex items-center">
            <p>{stylistNames.join(", ")}</p>
          </div>
        </div>
      </div>

      <hr className="my-5 text-gray-fourth" />

      {/* service listing header*/}
      <div className="flex items-center justify-between">
        <p className="text-lg font-bold text-secondary">Service</p>
        {/* <ActionButton
          variant="primary"
          size="sm"
          type="button"
          className="px-6 py-1.5 font-bold"
          onClick={() => console.log("first")}
        >
          Edit
        </ActionButton> */}
      </div>
      {/* service listing */}
      <div className="flex flex-col gap-2 mt-3">
        <div className="flex items-center justify-between">
          <p>
            - {selectedService?.serviceName}/ {selectedService?.serviceName_mm}
          </p>
          <p>{selectedService?.servicePrice.toLocaleString()} KS</p>
        </div>

        {selectedService?.isPromotionService && (
          <p className="text-sm text-secondary font-semibold">
            {selectedService.promotionDiscount}% off
          </p>
        )}
      </div>

      <hr className="my-5 text-gray-fourth" />

      {/* promo code input */}
      {/* <div className="bg-white rounded-xl px-3 py-2 flex items-center gap-1 shadow">
        <input
          type="text"
          className="w-full outline-none text-sm"
          placeholder="Promo Code"
          disabled
        />
        <ActionButton
          variant="primary"
          size="sm"
          type="button"
          className="px-4 py-1.5 font-bold"
          onClick={() => console.log("first")}
        >
          Apply
        </ActionButton>
      </div> */}

      {/* subtotal and discount */}
      {/* <div className="flex flex-col gap-2 mt-3">
        <div className="flex items-center justify-between">
          <p>Sub-Total</p>
          <p>{selectedService?.servicePrice.toLocaleString()} KS</p>
        </div>
        <div className="flex items-center justify-between">
          <p>Discount</p>
          <p>-0 KS</p>
        </div>
      </div> */}

      {/* <hr className="my-5 text-gray-fourth" /> */}

      {/* total cost */}
      <div className="flex items-center justify-between">
        <p>Total Cost</p>
        <p>
          {Number(selectedService?.servicePrice).toLocaleString()}
          KS
        </p>
      </div>

      {/* payment methods */}
      <p className="text-lg font-bold text-secondary mt-7">Payment Method</p>
      <div className="flex items-center justify-center flex-wrap gap-5 mt-3">
        {paymentsList.map((item) => (
          <ActionButton
            key={item.id}
            variant={`${
              item.id === selectedPaymentMethod ? "primary" : "outline"
            }`}
            size="md"
            Icon={item.icon}
            type="button"
            className="rounded-xl"
            onClick={() => setSelectedPaymentMethod(item.id)}
          >
            {item.name}
          </ActionButton>
        ))}
      </div>

      {/* action buttons */}
      {createLoading ? (
        <Loading />
      ) : (
        <div className="flex items-center gap-5 my-10">
          <Button variant="primary" type="button" onClick={() => navigate(-1)}>
            Cancel
          </Button>
          <Button variant="primary" type="button" onClick={handleAddBooking}>
            Confirm
          </Button>
        </div>
      )}
      {sheetModalOpen && (
        <BottomSheetModal isOpen={sheetModalOpen} setOpen={setSheetModalOpen} />
      )}

      {errorMessageSliderOpen && (
        <ErrorMessageSlider
          message={errorMessage}
          isOpen={errorMessageSliderOpen}
          setOpen={setErrorMessageSliderOpen}
        />
      )}
    </div>
  );
};

export default BookingConfirmScreen;
