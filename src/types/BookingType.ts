export type BookingType = {
  bookingId: string;
  serviceId: string;
  serviceName: string;
  stylistId: Array<string>;
  stylistName: Array<string>;
  bookingCreatedDate: string;
  bookingUserId: string;
  bookingUserName: string;
  bookingUserEmail: string;
  bookingStatus: string;
};
