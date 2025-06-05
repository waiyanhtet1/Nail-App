import axios from "axios";
import { useRef, useState } from "react";
import { Sheet, SheetRef } from "react-modal-sheet";
import { BASE_URL } from "../../constants/baseUrl";
import { encryptData } from "../../libs/encryption";
import showToast from "../../libs/toastUtil";
import { getLoginUser } from "../../libs/userUtils";
import Button from "../Button";
import Input from "../Input";
import Loading from "../Loading";

interface Props {
  isOpen: boolean;
  setOpen: (value: boolean) => void;
}

const UserNameBottomSheet = ({ isOpen, setOpen }: Props) => {
  const ref = useRef<SheetRef>(null);
  const userInfo = getLoginUser();

  const [usernameInput, setUsernameInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const handleUpdateUsername = async () => {
    if (usernameInput === "") {
      setIsError(true);
      return;
    } else {
      setIsError(false);
      setIsLoading(true);
      try {
        const { data } = await axios.put(`${BASE_URL}/update-profile`, {
          userId: userInfo._id,
          username: usernameInput,
        });

        console.log("updated", data);
        localStorage.setItem("userInfo", encryptData(data.user));
        showToast(data.message);
        setOpen(false);
      } catch (error) {
        console.log(error);
      }
      setIsLoading(false);
    }
  };

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
              <h1 className="text-secondary text-xl font-bold">
                Update Your Username
              </h1>
              <p className="text-sm text-gray-second mt-3">
                You need to provide your own username to be use in application.
              </p>

              <div className="mt-7 flex flex-col gap-3">
                <div className="">
                  <Input
                    isBorder
                    label="Username"
                    type="text"
                    value={usernameInput}
                    setValue={setUsernameInput}
                  />
                  {isError && (
                    <p className="text-sm text-red-primary">
                      Username is required
                    </p>
                  )}
                </div>

                {isLoading ? (
                  <Loading />
                ) : (
                  <div className="w-full flex items-center justify-center mt-3">
                    <Button
                      type="button"
                      variant="primary"
                      onClick={handleUpdateUsername}
                    >
                      Update
                    </Button>
                  </div>
                )}
              </div>
            </Sheet.Scroller>
          </Sheet.Content>
        </Sheet.Container>
        <Sheet.Backdrop />
      </Sheet>
    </>
  );
};

export default UserNameBottomSheet;
