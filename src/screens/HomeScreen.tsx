import axios from "axios";
import { useEffect, useState } from "react";
import Header from "../components/Header";
import Loading from "../components/Loading";
import { BASE_URL } from "../constants/baseUrl";
import CategoriesSection from "../sections/homeSections/CategoriesSection";
import PromotionSlider from "../sections/homeSections/PromotionSlider";
import StyleListSection from "../sections/homeSections/StyleListSection";
import { serviceCategoriesType, StyleListType } from "../types/types";

const HomeScreen = () => {
  const [services, setServices] = useState<serviceCategoriesType[]>([]);
  const [styleList, setStyleList] = useState<StyleListType[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function getHomeData() {
      setIsLoading(true);
      try {
        const { data } = await axios.get(`${BASE_URL}/homepage`);
        console.log(data);
        setServices(data.serviceCategories);
        setStyleList(data.stylists);
      } catch (error) {
        console.log(error);
      }
      setIsLoading(false);
    }

    getHomeData();
  }, []);

  return (
    <div>
      <Header />
      <div className="overflow-y-scroll h-[calc(100vh-250px)] no-scrollbar">
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
