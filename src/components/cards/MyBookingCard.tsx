import { useState } from "react";
import { formatDateTimeString } from "../../libs/dateUtils";
import { BookingType } from "../../types/BookingType";
import ActionButton from "../ActionButton";
import BookingDetailBottomSheet from "../bottomSheets/BookingDetailBottomSheet";
import image from "/images/category.png";

interface Props {
  variant: "active" | "completed" | "cancel";
  booking: BookingType;
}

const MyBookingCard = ({ variant, booking }: Props) => {
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  return (
    <div className="bg-white rounded-xl p-3">
      {variant === "active" && (
        <>
          <p className="text-sm text-secondary font-bold">
            {formatDateTimeString(booking.bookingCreatedDate as string)}
          </p>
          <hr className="text-gray-fifth my-3" />
        </>
      )}

      {/* info */}
      <div className="flex items-center justify-between gap-3">
        {/* image */}
        <img
          src={image}
          alt=""
          className="w-[60px] h-[50px] rounded-xl bg-primary object-cover"
        />

        {/* title and description */}
        <div className="">
          <p className="text-sm font-semibold">{booking.serviceName}</p>
          <p className="text-sm mt-1">
            Lorem ipsum dolor sit amet consectetur adipisicing.
          </p>
        </div>

        {/* price */}
        <p className="whitespace-nowrap text-sm font-bold self-start">
          0,000 KS
        </p>
      </div>

      {/* action buttons */}
      {variant === "cancel" ? (
        <ActionButton
          variant="primary"
          type="button"
          size="sm"
          className="rounded-xl w-full mt-3"
          onClick={() => console.log("first")}
        >
          Re-Book
        </ActionButton>
      ) : (
        <div className="flex items-center gap-5 mt-3">
          {variant === "active" && (
            <ActionButton
              variant="secondary"
              type="button"
              size="sm"
              className="rounded-xl w-full"
              onClick={() => console.log("first")}
            >
              Pending
            </ActionButton>
          )}
          {variant === "completed" && (
            <ActionButton
              variant="secondary"
              type="button"
              size="sm"
              className="rounded-xl w-full"
              onClick={() => console.log("first")}
            >
              Re-Book
            </ActionButton>
          )}
          {variant === "active" && (
            <ActionButton
              variant="primary"
              type="button"
              size="sm"
              className="rounded-xl w-full"
              onClick={() => setIsDetailModalOpen(true)}
            >
              View Booking Detail
            </ActionButton>
          )}
          {variant === "completed" && (
            <ActionButton
              variant="primary"
              type="button"
              size="sm"
              className="rounded-xl w-full"
              onClick={() => console.log("first")}
            >
              Write Review
            </ActionButton>
          )}
        </div>
      )}
      {isDetailModalOpen && (
        <BookingDetailBottomSheet
          booking={booking}
          isOpen={isDetailModalOpen}
          setOpen={setIsDetailModalOpen}
        />
      )}
    </div>
  );
};

export default MyBookingCard;
