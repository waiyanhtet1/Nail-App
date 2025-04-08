import { useRef } from "react";
import { Sheet, SheetRef } from "react-modal-sheet";
import { formatDateTimeString } from "../../libs/dateUtils";
import { BookingType } from "../../types/BookingType";

interface Props {
  isOpen: boolean;
  setOpen: (value: boolean) => void;
  booking: BookingType;
}

const BookingDetailBottomSheet = ({ isOpen, setOpen, booking }: Props) => {
  const ref = useRef<SheetRef>(null);

  return (
    <>
      <Sheet
        isOpen={isOpen}
        onClose={() => setOpen(false)}
        snapPoints={[600, 450]}
        initialSnap={1}
      >
        <Sheet.Container>
          <Sheet.Header />
          <Sheet.Content style={{ paddingBottom: ref.current?.y }}>
            <Sheet.Scroller draggableAt="both" className="mx-7">
              {/* Some content here that makes the sheet content scrollable */}
              <div className="flex flex-col gap-3">
                <BookingItem
                  title="Booking Date & Time"
                  value={formatDateTimeString(booking.bookingCreatedDate)}
                />
                <BookingItem title="Booking Number" value={""} />
                <BookingItem
                  title="Booking Stylists"
                  value={booking.stylistName.join(",")}
                />
                <BookingItem title="Number of Person" value={""} />
                <BookingItem title="Payment Method" value={""} />
                {/* <p className="font-semibold text-lg text-secondary">Service</p> */}
                <BookingItem title="Service" value={booking.serviceName} />
              </div>
            </Sheet.Scroller>
          </Sheet.Content>
        </Sheet.Container>
        <Sheet.Backdrop />
      </Sheet>
    </>
  );
};

export default BookingDetailBottomSheet;

interface BookingItemType {
  title: string;
  value: string;
}
export const BookingItem = ({ title, value }: BookingItemType) => {
  return (
    <div className="flex items-center justify-between">
      <p>{title}</p>
      <p>{value}</p>
    </div>
  );
};
