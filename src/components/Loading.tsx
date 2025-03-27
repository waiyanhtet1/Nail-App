import { IonSpinner } from "@ionic/react";

const Loading = () => {
  return (
    <IonSpinner
      className="flex justify-center w-full"
      name="lines-sharp"
    ></IonSpinner>
  );
};

export default Loading;
