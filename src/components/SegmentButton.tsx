import {
  IonLabel,
  IonSegment,
  IonSegmentButton,
  IonSegmentContent,
  IonSegmentView,
} from "@ionic/react";
import ActiveBookingCardList from "../screens/booking/myBooking/ActiveBookingCardList";
import CancelBookingCardList from "../screens/booking/myBooking/CancelBookingCardList";
import CompletedBookingCardList from "../screens/booking/myBooking/CompletedBookingCardList";

const SegmentButton = () => {
  return (
    <>
      <IonSegment value="first">
        <IonSegmentButton value="first" contentId="first">
          <IonLabel>Active</IonLabel>
        </IonSegmentButton>
        <IonSegmentButton value="second" contentId="second">
          <IonLabel>Completed</IonLabel>
        </IonSegmentButton>
        <IonSegmentButton value="third" contentId="third">
          <IonLabel>Cancelled</IonLabel>
        </IonSegmentButton>
      </IonSegment>
      <IonSegmentView>
        <IonSegmentContent id="first">
          <ActiveBookingCardList />
        </IonSegmentContent>
        <IonSegmentContent id="second">
          <CompletedBookingCardList />
        </IonSegmentContent>
        <IonSegmentContent id="third">
          <CancelBookingCardList />
        </IonSegmentContent>
      </IonSegmentView>
    </>
  );
};

export default SegmentButton;
