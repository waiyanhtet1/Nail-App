import {
  IonIcon,
  IonTab,
  IonTabBar,
  IonTabButton,
  IonTabs,
  IonToast,
} from "@ionic/react";
import axios from "axios";
import {
  calendarOutline,
  chatbubbleEllipsesOutline,
  flagOutline,
  homeOutline,
  pricetagsOutline,
} from "ionicons/icons";
import { useEffect, useState } from "react";
import { BASE_URL } from "../constants/baseUrl";
import { getLoginUser } from "../libs/userUtils";
import BookingScreen from "../screens/booking/BookingScreen";
import ChatHomeScreen from "../screens/chat/ChatHomeScreen";
import HomeScreen from "../screens/HomeScreen";
import PromotionScreen from "../screens/promotion/PromotionScreen";
import { CategoriesType, HomePageDataType, ServiceType } from "../types/types";

const MainLayout = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("home");
  const [homeData, setHomeData] = useState<HomePageDataType>();
  const [categoriesData, setCategoriesData] = useState<CategoriesType[]>();
  const [promotions, setPromotions] = useState<ServiceType[]>([]);
  const [isLoading, setSetIsLoading] = useState({
    home: false,
    categories: false,
    stamp: false,
  });

  const userInfo = getLoginUser();

  // Function to fetch home data
  const getHomeData = async () => {
    setSetIsLoading((prev) => ({
      ...prev,
      home: true,
    }));
    try {
      const { data } = await axios.get(`${BASE_URL}/homepage`);
      setHomeData(data);
    } catch (error) {
      console.log(error);
    }
    setSetIsLoading((prev) => ({
      ...prev,
      home: false,
    }));
  };

  // function to fetch booking data
  const getCategoriesData = async () => {
    setSetIsLoading((prev) => ({
      ...prev,
      categories: true,
    }));
    try {
      const { data } = await axios.get(`${BASE_URL}/admin/categories`);
      setCategoriesData(data);
    } catch (error) {
      console.log(error);
    }

    setSetIsLoading((prev) => ({
      ...prev,
      categories: false,
    }));
  };

  // function to get promotion data
  const getPromotionData = async () => {
    try {
      const { data } = await axios.get(`${BASE_URL}/promotions/active`);
      setPromotions(data.promotions);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (activeTab === "home") {
      getHomeData();
    }
    if (activeTab === "book") {
      getCategoriesData();
    }
    if (activeTab === "promo") {
      getPromotionData();
    }
  }, [activeTab]);

  return (
    <>
      <IonTabs onIonTabsDidChange={(e) => setActiveTab(e.detail.tab)}>
        <IonTab tab="home">
          <HomeScreen
            homePageData={homeData as HomePageDataType}
            isLoading={isLoading.home}
          />
        </IonTab>
        <IonTab tab="book">
          <BookingScreen
            categoriesData={categoriesData as CategoriesType[]}
            isLoading={isLoading.categories}
          />
        </IonTab>
        {userInfo && (
          <IonTab tab="promo">
            <PromotionScreen promotions={promotions} />
          </IonTab>
        )}
        <IonTab tab="chat">
          <ChatHomeScreen />
        </IonTab>

        <IonTabBar slot="bottom" className="h-[70px]">
          <IonTabButton tab="home">
            <div className="flex items-center gap-2">
              <IonIcon icon={homeOutline} className="size-5" />
              <p className="text-sm">Home</p>
            </div>
          </IonTabButton>
          <IonTabButton tab="book">
            <div className="flex items-center gap-2">
              <IonIcon icon={calendarOutline} className="size-5" />
              <p className="text-sm">Book</p>
            </div>
          </IonTabButton>
          {userInfo && (
            <IonTabButton tab="promo">
              <div className="flex items-center gap-2">
                <IonIcon icon={pricetagsOutline} className="size-5" />
                <p className="text-sm">Promo</p>
              </div>
            </IonTabButton>
          )}
          <IonTabButton tab="chat">
            <div className="flex items-center gap-2">
              <IonIcon icon={chatbubbleEllipsesOutline} className="size-5" />
              <p className="text-sm">Chat</p>
            </div>
          </IonTabButton>
        </IonTabBar>
      </IonTabs>
      <IonToast
        isOpen={isOpen}
        message="Login Success"
        onDidDismiss={() => setIsOpen(false)}
        duration={1000}
        icon={flagOutline}
      ></IonToast>
    </>
  );
};

export default MainLayout;
