import { cardOutline, cashOutline, qrCodeOutline } from "ionicons/icons";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ActionButton from "../../components/ActionButton";
import BottomSheetModal from "../../components/BottomSheetModal";
import Button from "../../components/Button";

const paymentsList = [
  {
    id: 1,
    name: "Cash",
    icon: cashOutline,
  },

  {
    id: 2,
    name: "Debit Card",
    icon: cardOutline,
  },
  {
    id: 3,
    name: "Digital Pay",
    icon: qrCodeOutline,
  },
];

const BookingConfirmScreen = () => {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(
    paymentsList[0].id
  );
  const [sheetModalOpen, setSheetModalOpen] = useState(false);

  const navigate = useNavigate();

  return (
    <div className="mt-10 mx-5">
      <p className="text-xl font-bold text-secondary">Booking Detail</p>
      <hr className="mt-3 mb-5 text-gray-fourth" />

      {/* booking info */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <p>Booking Date:</p>
          <p>22 Wednesday, 2025</p>
        </div>
        <div className="flex items-center justify-between">
          <p>Booking Time:</p>
          <p>11:30 AM</p>
        </div>
        <div className="flex items-center justify-between">
          <p>Number of Person:</p>
          <p>4</p>
        </div>
        <div className="flex items-center justify-between">
          <p>Stylist Name:</p>
          <p>Su Mon</p>
        </div>
      </div>

      <hr className="my-5 text-gray-fourth" />

      {/* service listing header*/}
      <div className="flex items-center justify-between">
        <p className="text-lg font-bold text-secondary">Service</p>
        <ActionButton
          variant="primary"
          size="sm"
          type="button"
          className="px-6 py-1.5 font-bold"
          onClick={() => console.log("first")}
        >
          Edit
        </ActionButton>
      </div>
      {/* service listing */}
      <div className="flex flex-col gap-2 mt-3">
        <div className="flex items-center justify-between">
          <p>- Classic Manicure</p>
          <p>27,000 KS</p>
        </div>
        <div className="flex items-center justify-between">
          <p>- Classic Manicure</p>
          <p>27,000 KS</p>
        </div>
      </div>

      <hr className="my-5 text-gray-fourth" />

      {/* promo code input */}
      <div className="bg-white rounded-xl px-3 py-2 flex items-center gap-1 shadow">
        <input
          type="text"
          className="w-full outline-none text-sm"
          placeholder="Promo Code"
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
          <p>57,000 KS</p>
        </div>
        <div className="flex items-center justify-between">
          <p>Discount</p>
          <p>-7,000 KS</p>
        </div>
      </div>

      <hr className="my-5 text-gray-fourth" />

      {/* total cost */}
      <div className="flex items-center justify-between">
        <p>Total Cost</p>
        <p>50,000 KS</p>
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
      <BottomSheetModal isOpen={sheetModalOpen} setOpen={setSheetModalOpen} />
    </div>
  );
};

export default BookingConfirmScreen;
