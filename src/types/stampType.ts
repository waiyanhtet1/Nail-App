export type StampItem = {
  _id: string;
  stampName: string;
  stampOrder: number;
  serviceCategory: {
    _id: string;
    categoryName: string;
  } | null;
  service: {
    _id: string;
    serviceName: string;
  } | null;
  discount: number;
  isDiscountAvailable: boolean;
  loyalStampStatus: string;
};

export type StampType = {
  collected: Array<StampItem>;
  uncollected: Array<StampItem>;
};
