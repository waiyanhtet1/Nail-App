import { IonDatetime } from "@ionic/react";
import { useRef } from "react";
import { Sheet, SheetRef } from "react-modal-sheet";

interface Props {
  isOpen: boolean;
  setOpen: (value: boolean) => void;
  selectedDateInput: string;
  setSelectedDateInput: (value: string) => void;
  closingDays: number[];
}

const DateSelectBottomSheet = ({
  isOpen,
  setOpen,
  selectedDateInput,
  setSelectedDateInput,
  closingDays,
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
        <Sheet.Backdrop onTap={() => setOpen(false)} />

        <Sheet.Container>
          <Sheet.Header />
          <Sheet.Content style={{ paddingBottom: ref.current?.y }}>
            <Sheet.Scroller draggableAt="both" className="mx-7">
              {/* Some content here that makes the sheet content scrollable */}
              <h1 className="text-center text-secondary text-xl font-bold">
                Choose Date
              </h1>
              <IonDatetime
                presentation="date"
                value={selectedDateInput}
                isDateEnabled={(dateString) => {
                  const date = new Date(dateString);
                  return !closingDays.includes(date.getDay());
                }}
                onIonChange={(e) => {
                  const isoDate = e.detail.value; // e.g., "2025-04-05"
                  const formatted = new Date(isoDate as string)
                    .toISOString()
                    .split("T")[0]; // "YYYY-MM-DD"
                  setSelectedDateInput(formatted);
                  setOpen(false);
                }}
              />
            </Sheet.Scroller>
          </Sheet.Content>
        </Sheet.Container>
        <Sheet.Backdrop />
      </Sheet>
    </>
  );
};

export default DateSelectBottomSheet;
