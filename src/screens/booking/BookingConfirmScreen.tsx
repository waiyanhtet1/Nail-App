import axios from "axios";
import { cashOutline } from "ionicons/icons";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ActionButton from "../../components/ActionButton";
import BottomSheetModal from "../../components/bottomSheets/BottomSheetModal";
import Button from "../../components/Button";
import { BASE_URL } from "../../constants/baseUrl";
import { formatDateString, formatTimeString } from "../../libs/dateUtils";
import { useAppSelector } from "../../redux/hook";
import { BookingDetailType } from "../../types/bookingDetailType";

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
  const { bookingId } = useAppSelector((state) => state.booking);
  const [detail, setDetail] = useState<BookingDetailType>();

  const getBookingDetail = useCallback(async () => {
    try {
      const { data } = await axios.get(`${BASE_URL}/booking/${bookingId}`);
      console.log(data);
      setDetail(data);
    } catch (error) {
      console.log(error);
    }
  }, [bookingId]);

  useEffect(() => {
    getBookingDetail();
  }, [getBookingDetail]);

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(
    paymentsList[0].id
  );
  const [sheetModalOpen, setSheetModalOpen] = useState(false);

  const navigate = useNavigate();

  console.log(detail);

  return (
    <div className="mt-10 mx-5">
      <p className="text-xl font-bold text-secondary">Booking Detail</p>
      <hr className="mt-3 mb-5 text-gray-fourth" />

      {/* booking info */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <p>Booking Date:</p>
          <p>{formatDateString(detail?.bookingDate as string)}</p>
        </div>
        <div className="flex items-center justify-between">
          <p>Booking Time:</p>
          <p>{formatTimeString(detail?.bookingDate as string)}</p>
        </div>
        <div className="flex items-center justify-between">
          <p>Number of Person:</p>
          <p>{detail?.personCount}</p>
        </div>
        <div className="flex items-center justify-between">
          <p>Stylist Name:</p>
          {/* <p>Su Mon</p> */}
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
          <p>- {detail?.serviceName}</p>
          {/* <p>27,000 KS</p> */}
        </div>
      </div>

      <hr className="my-5 text-gray-fourth" />

      {/* promo code input */}
      <div className="bg-white rounded-xl px-3 py-2 flex items-center gap-1 shadow">
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
      </div>

      {/* subtotal and discount */}
      <div className="flex flex-col gap-2 mt-3">
        <div className="flex items-center justify-between">
          <p>Sub-Total</p>
          <p>{detail?.totalCost.toLocaleString()} KS</p>
        </div>
        <div className="flex items-center justify-between">
          <p>Discount</p>
          <p>{detail?.discountedAmount.toLocaleString()} KS</p>
        </div>
      </div>

      <hr className="my-5 text-gray-fourth" />

      {/* total cost */}
      <div className="flex items-center justify-between">
        <p>Total Cost</p>
        <p>
          {detail &&
            (
              detail?.totalCost - detail?.discountedAmount
            ).toLocaleString()}{" "}
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
      <div className="flex items-center gap-5 my-10">
        <Button
          variant="primary"
          type="button"
          onClick={() => setSheetModalOpen(true)}
        >
          Confirm
        </Button>
        <Button variant="primary" type="button" onClick={() => navigate(-1)}>
          Cancel
        </Button>
      </div>
      <BottomSheetModal
        detail={detail as BookingDetailType}
        isOpen={sheetModalOpen}
        setOpen={setSheetModalOpen}
      />
    </div>
  );
};

export default BookingConfirmScreen;
