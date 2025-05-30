import { useRef } from "react";
import { Sheet, SheetRef } from "react-modal-sheet";
import { formatDateString } from "../../libs/dateUtils";
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

  console.log(booking);

  return (
    <>
      <Sheet
        isOpen={isOpen}
        onClose={() => setOpen(false)}
        snapPoints={[600, 450]}
        initialSnap={1}
      >
        <Sheet.Backdrop onTap={() => setOpen(false)} />

        <Sheet.Container>
          <Sheet.Header />
          <Sheet.Content style={{ paddingBottom: ref.current?.y }}>
            <Sheet.Scroller draggableAt="both" className="mx-7">
              {/* Some content here that makes the sheet content scrollable */}
              <div className="flex flex-col gap-3">
                <BookingItem
                  title="Booking Date"
                  value={formatDateString(bookingDetail.bookingDate)}
                />
                <BookingItem
                  title="Time Slot"
                  value={bookingDetail.timeSlots[0].timeSlot}
                />
                <BookingItem
                  title="Booking Stylist"
                  value={booking.stylistName.join(",")}
                />
                {/* <BookingItem
                  title="Number of Person"
                  value={bookingDetail.personCount.toString()}
                /> */}

                <hr className="my-3 text-gray-fourth" />

                <p className="font-semibold text-lg text-secondary">Service</p>
                <BookingItem
                  title="Service"
                  value={booking.service?.serviceName as string}
                />

                {booking?.service?.isPromotionService && (
                  <p className="flex justify-end text-sm text-secondary font-semibold">
                    {booking.service.promotionDiscount}% off
                  </p>
                )}

                <hr className="my-3 text-gray-fourth" />

                <BookingItem
                  title="Total Amount"
                  value={`${bookingDetail.totalCost.toLocaleString()} KS`}
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
