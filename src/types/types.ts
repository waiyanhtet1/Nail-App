export type serviceCategoriesType = {
  _id: string;
  categoryName: string;
  categoryIcon: string;
};

export type StyleListType = {
  _id: string;
  stylistName: string;
  image: string;
};

export type CategoriesType = {
  id: string;
  name: string;
  icon: string;
};

export type HomePageDataType = {
  businessConfig: {
    _id: string;
    businessImage: string;
  };
  serviceCategories: Array<serviceCategoriesType>;
  stylists: Array<StyleListType>;
};

export type ServiceType = {
  _id: string;
  serviceName: string;
  serviceName_mm: string;
  serviceCategory: string;
  serviceDescription: string;
  serviceDescription_mm: string;
  serviceIcon: string;
  serviceDuration: number;
  servicePrice: number;
  serviceDesignImages: Array<string>;
  serviceStylists: [
    {
      _id: string;
      stylistName: string;
    }
  ];
  createdAt: string;
  updatedAt: string;
  isPromotionService: boolean;
  promotionDiscount: number;
  promotionEndDate: string;
  promotionName: string;
  promotionStartDate: string;
};

export type ServiceDetailType = {
  businessConfig: {
    from: string;
    to: string;
    closingDays: Array<string>;
  };
  stylists: Array<StyleListType>;
  timeSlots: [
    {
      timeSlot: string;
      timeSlotStatus: string;
    }
  ];
};
