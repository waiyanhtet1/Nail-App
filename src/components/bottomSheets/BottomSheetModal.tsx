import { useRef } from "react";
import { Sheet, SheetRef } from "react-modal-sheet";
import ActionButton from "../ActionButton";
import Button from "../Button";
import successImg from "/images/success.png";

interface Props {
  isOpen: boolean;
  setOpen: (value: boolean) => void;
}

function BottomSheetModal({ isOpen, setOpen }: Props) {
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
              <h1 className="text-center text-secondary text-xl font-bold">
                Booking Successful
              </h1>
              <p className="text-xs text-secondary text-center mt-2">
                Your Booking Number is 000001
              </p>

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
                  <p>(2) Services</p>
                  <p className="text-sm">2 Persons</p>
                </div>
                <div className="w-full flex flex-col items-center justify-center gap-2 p-3 border-t border-b border-gray-fourth">
                  <p className="whitespace-nowrap">Date : 22 April,2025</p>
                  <p className="text-xs">(Wednesday)</p>
                  <p className="text-sm">11:00 PM</p>
                </div>
              </div>

              {/* action buttons */}
              <div className="flex flex-col gap-3 mt-5">
                <Button variant="primary" type="button">
                  Booking Detail
                </Button>
                <ActionButton
                  variant="outline"
                  type="button"
                  size="md"
                  className="w-full rounded-[100px] py-3 font-bold"
                  onClick={() => console.log("first")}
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
