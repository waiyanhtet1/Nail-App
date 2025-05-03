import { ServiceType } from "./types";

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
  serviceCategory: {
    _id: string;
    categoryName: string;
    categoryName_mm: string;
    createdAt: string;
    updatedAt: string;
  };
  service?: ServiceType;
  // {
  //   _id?: string;
  //   serviceName?: string;
  //   serviceName_mm?: string;
  //   serviceCategory: {
  //     _id?: string;
  //     categoryName?: string;
  //     categoryName_mm?: string;
  //     createdAt?: string;
  //     updatedAt?: string;
  //   };
  //   serviceDescription?: string;
  //   serviceDescription_mm?: string;
  //   serviceDuration?: number;
  //   servicePrice?: number;
  //   serviceStylists?: Array<string>;
  //   createdAt?: string;
  //   updatedAt?: string;
  // };
};

export type SelectedBookingType = {
  // serviceId: string;
  customerUserId: string;
  date: string;
  personCount: number;
  stylist: {
    _id: string;
    stylistName: string;
  };
  timeSlot: string;
};
