import { useRef } from "react";
import { Sheet, SheetRef } from "react-modal-sheet";
import { useNavigate } from "react-router-dom";
import { formatDateString } from "../../libs/dateUtils";
import { useAppSelector } from "../../redux/hook";
import ActionButton from "../ActionButton";
import Button from "../Button";
import successImg from "/images/success.png";

interface Props {
  isOpen: boolean;
  setOpen: (value: boolean) => void;
}

function BottomSheetModal({ isOpen, setOpen }: Props) {
  const ref = useRef<SheetRef>(null);
  const { selectedBooking, selectedService } = useAppSelector(
    (state) => state.booking
  );
  const navigate = useNavigate();

  return (
    <>
      <Sheet
        isOpen={isOpen}
        onClose={() => setOpen(false)}
        snapPoints={[600, 450]}
        initialSnap={1}
        disableDrag
      >
        <Sheet.Container>
          <Sheet.Header />
          <Sheet.Content style={{ paddingBottom: ref.current?.y }}>
            <Sheet.Scroller draggableAt="both" className="mx-7">
              {/* Some content here that makes the sheet content scrollable */}
              <h1 className="text-center text-secondary text-xl font-bold">
                Booking Successful
              </h1>
              {/* <p className="text-xs text-secondary text-center mt-2">
                Your Booking Number is 000001
              </p> */}

              {/* success image */}
              <div className="flex justify-center mt-5">
                <div className="flex items-center justify-center bg-primary w-[60px] h-[60px] rounded-full p-3">
                  <img
                    src={successImg}
                    alt=""
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>

              {/* info result */}
              <div className="flex justify-between mt-7">
                <div className="w-full flex flex-col items-center justify-center p-3 border-t border-r border-b border-gray-fourth">
                  <p>({selectedService?.serviceName}) Services</p>
                  <p className="text-sm">
                    {selectedBooking?.personCount} Persons
                  </p>
                </div>
                <div className="w-full flex flex-col items-center justify-center gap-2 p-3 border-t border-b border-gray-fourth">
                  <p className="whitespace-nowrap">
                    Date : {formatDateString(selectedBooking?.date as string)}
                  </p>
                  {/* <p className="text-xs">(Wednesday)</p> */}
                  <p className="text-sm">{selectedBooking?.timeSlot}</p>
                </div>
              </div>

              {/* action buttons */}
              <div className="flex flex-col gap-3 mt-5">
                <div className="flex items-center justify-center">
                  <Button
                    variant="primary"
                    type="button"
                    className="rounded-[100px]"
                    onClick={() => navigate("/success-detail")}
                  >
                    Booking Detail
                  </Button>
                </div>
                <ActionButton
                  variant="outline"
                  type="button"
                  size="md"
                  className="w-full rounded-xl py-3 font-bold"
                  onClick={() => navigate("/")}
                >
                  Back To Home Screen
                </ActionButton>
              </div>
            </Sheet.Scroller>
          </Sheet.Content>
        </Sheet.Container>
        <Sheet.Backdrop />
      </Sheet>
    </>
  );
}

export default BottomSheetModal;
