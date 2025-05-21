import { useEffect, useState } from "react";
import Header from "../components/Header";
import Loading from "../components/Loading";
import CategoriesSection from "../sections/homeSections/CategoriesSection";
import PromotionSlider from "../sections/homeSections/PromotionSlider";
import StyleListSection from "../sections/homeSections/StyleListSection";
import {
  HomePageDataType,
  serviceCategoriesType,
  StyleListType,
} from "../types/types";

interface Props {
  homePageData: HomePageDataType;
  isLoading: boolean;
}

const HomeScreen = ({ homePageData, isLoading }: Props) => {
  const [services, setServices] = useState<serviceCategoriesType[]>([]);
  const [styleList, setStyleList] = useState<StyleListType[]>([]);

  useEffect(() => {
    setServices(homePageData?.serviceCategories);
    setStyleList(homePageData?.stylists);
  }, [homePageData]);

  return (
    <div>
      <Header />
      <div className="overflow-y-scroll h-[calc(100vh-190px)] no-scrollbar">
        {isLoading ? (
          <Loading />
        ) : (
          <>
            <PromotionSlider />
            <CategoriesSection services={services} />
            <StyleListSection stylists={styleList} />
          </>
        )}
      </div>
    </div>
  );
};

export default HomeScreen;
