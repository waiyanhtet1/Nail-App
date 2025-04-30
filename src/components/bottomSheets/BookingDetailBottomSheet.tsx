import { useRef } from "react";
import { Sheet, SheetRef } from "react-modal-sheet";
import { formatDateTimeString } from "../../libs/dateUtils";
import { BookingType } from "../../types/BookingType";
import { BookingDetailType } from "../../types/bookingDetailType";

interface Props {
  isOpen: boolean;
  setOpen: (value: boolean) => void;
  booking: BookingType;
  bookingDetail: BookingDetailType;
}

const BookingDetailBottomSheet = ({
  isOpen,
  setOpen,
  booking,
  bookingDetail,
}: Props) => {
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
                <BookingItem
                  title="Time Slot"
                  value={bookingDetail.timeSlots[0].timeSlot}
                />
                <BookingItem
                  title="Booking Stylists"
                  value={booking.stylistName.join(",")}
                />
                <BookingItem
                  title="Number of Person"
                  value={bookingDetail.personCount.toString()}
                />

                <hr className="my-3 text-gray-fourth" />

                <p className="font-semibold text-lg text-secondary">Service</p>
                <BookingItem title="Service" value={booking.serviceName} />
                <BookingItem
                  title="Discount"
                  value={`- ${bookingDetail.discountedAmount.toLocaleString()} KS`}
                />
                <BookingItem
                  title="Total Amount"
                  value={`${(
                    bookingDetail.totalCost - bookingDetail.discountedAmount
                  ).toLocaleString()} KS`}
                />
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
