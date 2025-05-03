import { useRef } from "react";
import { Sheet, SheetRef } from "react-modal-sheet";
import ActionButton from "../ActionButton";

interface Props {
  isOpen: boolean;
  setOpen: (value: boolean) => void;
  title: string;
  description: string;
  actionButtonText: string;
  actionButtonHandler: () => void;
  variant: "primary" | "secondary" | "outline" | "error";
}

const ConfirmBottomSlider = ({
  isOpen,
  setOpen,
  title,
  description,
  actionButtonText,
  actionButtonHandler,
  variant,
}: Props) => {
  const ref = useRef<SheetRef>(null);

  return (
    <>
      <Sheet
        isOpen={isOpen}
        onClose={() => setOpen(false)}
        snapPoints={[180, 180]}
        initialSnap={1}
      >
        <Sheet.Backdrop onTap={() => setOpen(false)} />

        <Sheet.Container>
          <Sheet.Header />
          <Sheet.Content style={{ paddingBottom: ref.current?.y }}>
            <Sheet.Scroller draggableAt="both" className="mx-7">
              {/* Some content here that makes the sheet content scrollable */}
              <div className="flex flex-col gap-3">
                <p className="font-bold">{title}</p>
                <p>{description}</p>
                <div className="flex items-center w-full gap-3">
                  <ActionButton
                    variant="outline"
                    size="md"
                    type="button"
                    className="w-full"
                    onClick={() => setOpen(false)}
                  >
                    Cancel
                  </ActionButton>
                  <ActionButton
                    variant={variant}
                    size="md"
                    type="button"
                    className="w-full"
                    onClick={actionButtonHandler}
                  >
                    {actionButtonText}
                  </ActionButton>
                </div>
              </div>
            </Sheet.Scroller>
          </Sheet.Content>
        </Sheet.Container>
        <Sheet.Backdrop />
      </Sheet>
    </>
  );
};

export default ConfirmBottomSlider;
