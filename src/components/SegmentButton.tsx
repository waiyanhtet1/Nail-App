import {
  IonLabel,
  IonSegment,
  IonSegmentButton,
  IonSegmentContent,
  IonSegmentView,
} from "@ionic/react";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { BASE_URL } from "../constants/baseUrl";
import { getLoginUser } from "../libs/userUtils";
import ActiveBookingCardList from "../screens/booking/myBooking/ActiveBookingCardList";
import CancelBookingCardList from "../screens/booking/myBooking/CancelBookingCardList";
import CompletedBookingCardList from "../screens/booking/myBooking/CompletedBookingCardList";
import { BookingType } from "../types/BookingType";
import Loading from "./Loading";

const SegmentButton = () => {
  const [activeBookings, setActiveBookings] = useState<BookingType[]>([]);
  const [completedBookings, setCompletedBookings] = useState<BookingType[]>([]);
  const [cancelledBookings, setCancelledBookings] = useState<BookingType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const userInfo = getLoginUser();

  const getBookingList = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data } = await axios.get(`${BASE_URL}/bookings/${userInfo._id}`);

      // filter active status bookings
      const activeBookingList = data.filter(
        (item: BookingType) => item.bookingStatus === "active"
      );
      setActiveBookings(activeBookingList);

      // filter completed status bookings
      const completedBookingList = data.filter(
        (item: BookingType) => item.bookingStatus === "completed"
      );
      setCompletedBookings(completedBookingList);

      // filter cancelled status bookings
      const cancelledBookingList = data.filter(
        (item: BookingType) => item.bookingStatus === "cancelled"
      );
      setCancelledBookings(cancelledBookingList);
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  }, [userInfo._id]);

  useEffect(() => {
    getBookingList();
  }, [getBookingList]);

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
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
              <ActiveBookingCardList bookings={activeBookings} />
            </IonSegmentContent>
            <IonSegmentContent id="second">
              <CompletedBookingCardList bookings={completedBookings} />
            </IonSegmentContent>
            <IonSegmentContent id="third">
              <CancelBookingCardList bookings={cancelledBookings} />
            </IonSegmentContent>
          </IonSegmentView>
        </>
      )}
    </>
  );
};

export default SegmentButton;
