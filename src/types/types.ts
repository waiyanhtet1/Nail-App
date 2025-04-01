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
