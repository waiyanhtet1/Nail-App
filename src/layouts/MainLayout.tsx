import {
  IonIcon,
  IonTab,
  IonTabBar,
  IonTabButton,
  IonTabs,
  IonToast,
} from "@ionic/react";
import {
  calendarOutline,
  chatbubbleEllipsesOutline,
  flagOutline,
  homeOutline,
  pricetagsOutline,
} from "ionicons/icons";
import { useState } from "react";
import HomeScreen from "../screens/HomeScreen";

const MainLayout = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="">
      <IonTabs>
        <IonTab tab="home">
          <HomeScreen />
        </IonTab>
        <IonTab tab="book">
          <div>Radio content</div>
        </IonTab>
        <IonTab tab="promo">
          <div>Library content</div>
        </IonTab>
        <IonTab tab="chat">
          <div>search</div>
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
          <IonTabButton tab="promo">
            <div className="flex items-center gap-2">
              <IonIcon icon={pricetagsOutline} className="size-5" />
              <p className="text-sm">Promo</p>
            </div>
          </IonTabButton>
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
    </div>
  );
};

export default MainLayout;
