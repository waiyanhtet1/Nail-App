export type StylistType = {
  id: string;
  stylistName: string;
  position: string;
  status: string;
  image: string;
  offeredServiceCategory: {
    _id: string;
    categoryName: string;
    categoryName_mm: string;
    categoryIcon: string;
    createdAt: string;
    updatedAt: string;
  };
  description: string;
  designImages: [];
};
