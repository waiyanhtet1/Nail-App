type timeSlotType = {
  timeSlot: string;
};

export type BookingDetailType = {
  bookingId: string;
  serviceName: string;
  personCount: number;
  bookingDate: string;
  timeSlots: Array<timeSlotType>;
  totalCost: number;
  discountApplied: boolean;
  discountedAmount: number;
  bookingStatus: string;
};
