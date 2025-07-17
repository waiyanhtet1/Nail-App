import { SplashScreen } from "@capacitor/splash-screen";
import "@codetrix-studio/capacitor-google-auth"; // only needed for web
import { setupIonicReact } from "@ionic/react";
import "@ionic/react/css/core.css";
import OneSignal from "onesignal-cordova-plugin";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import {
  Route,
  BrowserRouter as Router,
  Routes,
  useLocation,
} from "react-router-dom"; // Import BrowserRouter
import { CSSTransition, TransitionGroup } from "react-transition-group"; // Import transition components
import AppBackButtonHandler from "./AppBackButtonHandler";
import MainLayout from "./layouts/MainLayout";
import { useAppDispatch } from "./redux/hook";
import { setSubId, setToken } from "./redux/slices/tokenSlice";
import ForgotPassword from "./screens/auth/ForgotPassword";
import LoginScreen from "./screens/auth/LoginScreen";
import NewPasswordScreen from "./screens/auth/NewPasswordScreen";
import OTPScreen from "./screens/auth/OTPScreen";
import RegisterScreen from "./screens/auth/RegisterScreen";
import AddBookingScreen from "./screens/booking/AddBookingScreen";
import BookingConfirmScreen from "./screens/booking/BookingConfirmScreen";
import MyBookingScreen from "./screens/booking/myBooking/MyBookingScreen";
import SuccessBookingDetail from "./screens/booking/SuccessBookingDetail";
import ChatHomeScreen from "./screens/chat/ChatHomeScreen";
import ChatScreen from "./screens/chat/ChatScreen";
import EditProfile from "./screens/profile/EditProfile";
import MyStamps from "./screens/profile/MyStamps";
import ProfileScreen from "./screens/profile/ProfileScreen";
import SettingScreen from "./screens/profile/SettingScreen";
import AllStylistScreen from "./screens/stylist/AllStylistScreen";

setupIonicReact({
  rippleEffect: false,
  mode: "md",
});

const App = () => {
  const location = useLocation();

  SplashScreen.hide();

  return (
    <>
      <Toaster position="bottom-center" reverseOrder={false} />
      <AppBackButtonHandler />
      <TransitionGroup>
        <CSSTransition
          key={location.key} // Unique key to identify the route
          classNames="page" // Class names for transition
          timeout={500} // Duration of the transition
        >
          <div className="page-container">
            <Routes location={location}>
              <Route index path="/" element={<MainLayout />} />
              <Route path="/login" element={<LoginScreen />} />
              <Route path="/register" element={<RegisterScreen />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/otp" element={<OTPScreen />} />
              <Route path="/new-password" element={<NewPasswordScreen />} />

              {/* booking screens */}
              <Route path="/add-booking" element={<AddBookingScreen />} />
              <Route
                path="confirm-booking"
                element={<BookingConfirmScreen />}
              />
              <Route
                path="/success-detail"
                element={<SuccessBookingDetail />}
              />
              <Route path="/stylists" element={<AllStylistScreen />} />

              {/* profile screens */}
              <Route path="/profile" element={<ProfileScreen />} />
              <Route path="/profile/edit" element={<EditProfile />} />
              <Route path="/profile/booking" element={<MyBookingScreen />} />
              <Route path="/profile/my-stamps" element={<MyStamps />} />
              <Route path="/profile/settings" element={<SettingScreen />} />

              {/* chat screens */}
              <Route path="/chat-home" element={<ChatHomeScreen />} />
              <Route path="/chat" element={<ChatScreen />} />
            </Routes>
          </div>
        </CSSTransition>
      </TransitionGroup>
    </>
  );
};

export default function Wrapper() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const initOneSignal = async () => {
      try {
        // Set debug logs
        OneSignal.Debug.setLogLevel(6);

        // Initialize with your OneSignal App ID
        await OneSignal.initialize("624a863f-5157-4806-8b92-e0b5bc351b76");

        // Request permission
        const permission = await OneSignal.Notifications.requestPermission(
          true
        );
        console.log("🔔 Notification permission:", permission);

        // Try getting the Player ID directly
        const playerId = await OneSignal.User.getOnesignalId();
        const subscriptionId = OneSignal.User.pushSubscription?.id;

        if (playerId) {
          console.log("🎯 Player ID:", playerId);
          dispatch(setToken(playerId));
        } else {
          console.warn("❌ Player ID not yet available");
        }

        if (subscriptionId) {
          console.log("📮 Subscription ID:", subscriptionId);
          dispatch(setSubId(subscriptionId));
        } else {
          console.warn("❌ Subscription ID not yet available");
        }

        // Extra delay fallback (3 seconds later)
        setTimeout(async () => {
          const delayedPlayerId = await OneSignal.User.getOnesignalId();
          const delayedSubId = OneSignal.User.pushSubscription?.id;

          if (delayedPlayerId) {
            console.log("⏱ Delayed Player ID:", delayedPlayerId);
            dispatch(setToken(delayedPlayerId));
          }

          if (delayedSubId) {
            console.log("⏱ Delayed Subscription ID:", delayedSubId);
            dispatch(setSubId(delayedSubId));
          }
        }, 3000);
      } catch (error) {
        console.error("🔥 OneSignal init error:", error);
      }
    };

    initOneSignal();
  }, [dispatch]);

  return (
    <Router>
      <App />
    </Router>
  );
}
