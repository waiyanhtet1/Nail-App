import { Toast } from "@capacitor/toast";

const showToast = async (message: string) => {
  await Toast.show({
    text: message,
  });
};

export default showToast;
