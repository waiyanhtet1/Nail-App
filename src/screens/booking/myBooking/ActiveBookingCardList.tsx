import MyBookingCard from "../../../components/cards/MyBookingCard";
import { BookingType } from "../../../types/BookingType";

interface Props {
  bookings: BookingType[];
  onUpdateData?: () => void;
}

const ActiveBookingCardList = ({ bookings, onUpdateData }: Props) => {
  console.log("active bookings", bookings);
  return (
    <div className="flex flex-col gap-3 mx-3 overflow-y-scroll h-[calc(100vh-160px)] no-scrollbar mt-3">
      {bookings && bookings.length === 0 ? (
        <div className="text-sm text-secondary font-semibold">No Result.</div>
      ) : (
        bookings.map((item) => (
          <MyBookingCard
            key={item.bookingId}
            booking={item}
            variant="active"
            onUpdateData={onUpdateData}
          />
        ))
      )}
    </div>
  );
};

export default ActiveBookingCardList;
