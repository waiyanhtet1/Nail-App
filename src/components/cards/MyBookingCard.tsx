import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../../constants/baseUrl";
import { formatDateTimeString } from "../../libs/dateUtils";
import { useAppDispatch } from "../../redux/hook";
import {
  setSelectedCategory,
  setSelectedService,
} from "../../redux/slices/bookingSlice";
import { BookingDetailType } from "../../types/bookingDetailType";
import { BookingType } from "../../types/BookingType";
import { ServiceType } from "../../types/types";
import ActionButton from "../ActionButton";
import BookingDetailBottomSheet from "../bottomSheets/BookingDetailBottomSheet";
import ConfirmBottomSlider from "../bottomSheets/ConfirmBottomSlider";
import image from "/images/category.png";

interface Props {
  variant: "active" | "completed" | "cancel";
  booking: BookingType;
}

const MyBookingCard = ({ variant, booking }: Props) => {
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [detail, setDetail] = useState<BookingDetailType | null>(null);
  const [isReBookConfirmOpen, setIsReBookConfirmOpen] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const getBookingDetail = useCallback(async () => {
    const { data } = await axios.get(
      `${BASE_URL}/booking/${booking.bookingId}`
    );

    setDetail(data);
    console.log(data);
  }, [booking.bookingId]);

  useEffect(() => {
    getBookingDetail();
  }, [getBookingDetail]);

  async function handleReBooking() {
    dispatch(
      setSelectedCategory({
        id: booking.serviceCategory._id,
        name: booking.serviceCategory.categoryName,
        icon: "",
      })
    );
    dispatch(setSelectedService(booking.service as ServiceType));
    navigate("/add-booking");
  }

  console.log("booking", booking);

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
      <div className="flex items-center justify-between">
        <div className="flex gap-3">
          {/* image */}
          <img
            src={image}
            alt=""
            className="w-[60px] h-[50px] rounded-xl bg-primary object-cover"
          />

          {/* title and description */}
          <p className="text-sm font-semibold">{detail?.serviceName}</p>
          {/* <p className="text-sm mt-1">
            Lorem ipsum dolor sit amet consectetur adipisicing.
          </p> */}
        </div>

        {/* price */}
        <p className="whitespace-nowrap text-sm font-bold self-start">
          {detail &&
            (
              detail?.totalCost - detail?.discountedAmount
            ).toLocaleString()}{" "}
          KS
        </p>
      </div>

      {/* action buttons */}
      {variant === "cancel" ? (
        <ActionButton
          variant="primary"
          type="button"
          size="sm"
          className="rounded-xl w-full mt-3"
          onClick={() => setIsReBookConfirmOpen(true)}
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
              onClick={() => setIsReBookConfirmOpen(true)}
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
              onClick={() => setIsDetailModalOpen(true)}
            >
              View Booking Detail
            </ActionButton>
          )}
        </div>
      )}
      {isDetailModalOpen && (
        <BookingDetailBottomSheet
          booking={booking}
          bookingDetail={detail as BookingDetailType}
          isOpen={isDetailModalOpen}
          setOpen={setIsDetailModalOpen}
        />
      )}
      {isReBookConfirmOpen && (
        <ConfirmBottomSlider
          isOpen={isReBookConfirmOpen}
          setOpen={(value) => setIsReBookConfirmOpen(value)}
          title="Re-Booking?"
          description={`Sure to re-booking "${booking.service?.serviceName}" Service?`}
          actionButtonText="Re-Book"
          actionButtonHandler={handleReBooking}
          variant="primary"
        />
      )}
    </div>
  );
};

export default MyBookingCard;
