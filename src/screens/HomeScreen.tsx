import { useEffect, useState } from "react";
import Header from "../components/Header";
import Loading from "../components/Loading";
import { useAppSelector } from "../redux/hook";
import ServiceListSection from "../sections/bookingSections/ServiceListSection";
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
  const { selectedCategory } = useAppSelector((state) => state.booking);

  useEffect(() => {
    setServices(homePageData?.serviceCategories);

    const updatedStylistData = homePageData?.stylists.slice(0, 5);
    setStyleList(updatedStylistData);
  }, [homePageData]);

  console.log(styleList);

  return (
    <div>
      <Header />
      <div className="overflow-y-scroll h-[calc(100vh-230px)] no-scrollbar">
        {isLoading ? (
          <Loading />
        ) : selectedCategory !== null ? (
          <div className="p-5">
            <ServiceListSection />
          </div>
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
