import { useRef } from "react";
import { Sheet, SheetRef } from "react-modal-sheet";

interface Props {
  isOpen: boolean;
  setOpen: (value: boolean) => void;
  message: string;
}

const ErrorMessageSlider = ({ isOpen, setOpen, message }: Props) => {
  const ref = useRef<SheetRef>(null);

  return (
    <>
      <Sheet
        isOpen={isOpen}
        onClose={() => setOpen(false)}
        snapPoints={[200, 200]}
        initialSnap={1}
      >
        <Sheet.Backdrop onTap={() => setOpen(false)} />

        <Sheet.Container>
          <Sheet.Header />
          <Sheet.Content style={{ paddingBottom: ref.current?.y }}>
            <Sheet.Scroller draggableAt="both" className="mx-7">
              {/* Some content here that makes the sheet content scrollable */}

              <h1 className="text-lg font-semibold text-red-primary">
                Booking Not Available!
              </h1>
              <hr className="my-5 text-gray-300" />
              <p className="text-red-500">{message}</p>
            </Sheet.Scroller>
          </Sheet.Content>
        </Sheet.Container>
        <Sheet.Backdrop onTap={() => setOpen(false)} />
      </Sheet>
    </>
  );
};

export default ErrorMessageSlider;
