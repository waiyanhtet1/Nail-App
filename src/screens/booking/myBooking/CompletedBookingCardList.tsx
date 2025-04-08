import MyBookingCard from "../../../components/cards/MyBookingCard";
import { BookingType } from "../../../types/BookingType";

interface Props {
  bookings: BookingType[];
}

const CompletedBookingCardList = ({ bookings }: Props) => {
  return (
    <div className="flex flex-col gap-3 mx-3 overflow-y-scroll h-[calc(100vh-150px)] no-scrollbar mt-3">
      {bookings && bookings.length === 0 ? (
        <div className="text-sm text-secondary font-semibold">No Result.</div>
      ) : (
        bookings.map((item: BookingType) => (
          <MyBookingCard
            key={item.bookingId}
            booking={item}
            variant="completed"
          />
        ))
      )}
    </div>
  );
};

export default CompletedBookingCardList;
