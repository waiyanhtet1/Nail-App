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
  promotionPrice: number;
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

// types.ts

/**
 * Represents a single chat message.
 */
export interface Message {
  id: string; // Unique message ID from the server or temporary client ID
  channelId: string;
  userId: string;
  text: string;
  created_at: string;
  isOptimistic?: boolean; // True if message is client-side optimistic update
  user?: {
    id: string;
  };
}

/**
 * Interface for the response when creating a new channel.
 */
export interface CreateChannelResponse {
  channelId: string;
}

/**
 * Interface for the body of the send-message request.
 */
export interface SendMessagePayload {
  channelId: string;
  userId: string;
  text: string;
}
