import axios from "axios";
import { useRef } from "react";
import { Sheet, SheetRef } from "react-modal-sheet";
import ActionButton from "../../components/ActionButton";
import { BASE_URL } from "../../constants/baseUrl";

interface Props {
  isOpen: boolean;
  setOpen: (value: boolean) => void;
  messageId: string;
}

const ChatDeleteSlider = ({ messageId, isOpen, setOpen }: Props) => {
  const ref = useRef<SheetRef>(null);

  const handleDeleteMessage = async () => {
    try {
      await axios.delete(`${BASE_URL}/stream/${messageId}/delete-message`);
      setOpen(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Sheet
        isOpen={isOpen}
        onClose={() => setOpen(false)}
        snapPoints={[150, 150]}
        initialSnap={1}
      >
        <Sheet.Container>
          <Sheet.Header />
          <Sheet.Content style={{ paddingBottom: ref.current?.y }}>
            <Sheet.Scroller draggableAt="both" className="mx-7">
              {/* Some content here that makes the sheet content scrollable */}
              <h1 className="text-red-primary text-xl font-bold mb-5">
                Delete Message?
              </h1>
              <ActionButton
                className="w-full"
                type="button"
                size="md"
                variant="error"
                onClick={handleDeleteMessage}
              >
                Delete
              </ActionButton>
            </Sheet.Scroller>
          </Sheet.Content>
        </Sheet.Container>
        <Sheet.Backdrop onTap={() => setOpen(false)} />
      </Sheet>
    </>
  );
};

export default ChatDeleteSlider;
