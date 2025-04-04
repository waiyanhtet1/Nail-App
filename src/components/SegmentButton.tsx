import {
  IonLabel,
  IonSegment,
  IonSegmentButton,
  IonSegmentContent,
  IonSegmentView,
} from "@ionic/react";

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
        <IonSegmentContent id="first" className="bg-white">
          First
        </IonSegmentContent>
        <IonSegmentContent id="second">Second</IonSegmentContent>
        <IonSegmentContent id="third">Third</IonSegmentContent>
      </IonSegmentView>
    </>
  );
};

export default SegmentButton;
