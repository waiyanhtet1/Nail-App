/* eslint-disable @typescript-eslint/no-explicit-any */
import { setupIonicReact } from "@ionic/react";
import "@ionic/react/css/core.css";
import OneSignal from "onesignal-cordova-plugin";
import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import {
  Route,
  BrowserRouter as Router,
  Routes,
  useLocation,
} from "react-router-dom"; // Import BrowserRouter
import { CSSTransition, TransitionGroup } from "react-transition-group"; // Import transition components
import AppBackButtonHandler from "./AppBackButtonHandler";
import UserNameBottomSheet from "./components/bottomSheets/UserNameBottomSheet";
import MainLayout from "./layouts/MainLayout";
import { getLoginUser } from "./libs/userUtils";
import { useAppDispatch } from "./redux/hook";
import { setToken } from "./redux/slices/tokenSlice";
import ForgotPassword from "./screens/auth/ForgotPassword";
import LoginScreen from "./screens/auth/LoginScreen";
import NewPasswordScreen from "./screens/auth/NewPasswordScreen";
import OTPScreen from "./screens/auth/OTPScreen";
import RegisterScreen from "./screens/auth/RegisterScreen";
import AddBookingScreen from "./screens/booking/AddBookingScreen";
import BookingConfirmScreen from "./screens/booking/BookingConfirmScreen";
import MyBookingScreen from "./screens/booking/myBooking/MyBookingScreen";
import ServiceListScreen from "./screens/booking/ServiceListScreen";
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
  const userInfo = getLoginUser();

  const [isUserNameUpdateModalOpen, setIsUserNameUpdateModalOpen] =
    useState(false);

  useEffect(() => {
    if (userInfo && userInfo.username === "AppleUser") {
      setIsUserNameUpdateModalOpen(true);
    }
  }, [userInfo, userInfo?.username]);

  console.log(userInfo);

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

              <Route path="/service-listing" element={<ServiceListScreen />} />
              <Route path="/add-booking" element={<AddBookingScreen />} />
              <Route
                path="confirm-booking"
                element={<BookingConfirmScreen />}
              />
              <Route
                path="/success-detail"
                element={<SuccessBookingDetail />}
              />

              <Route path="stylists" element={<AllStylistScreen />} />

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

      {isUserNameUpdateModalOpen && (
        <UserNameBottomSheet
          isOpen={isUserNameUpdateModalOpen}
          setOpen={setIsUserNameUpdateModalOpen}
        />
      )}
    </>
  );
};

export default function Wrapper() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const initOneSignal = async () => {
      try {
        // Set verbose debug logs
        OneSignal.Debug.setLogLevel(6);

        // Initialize OneSignal
        OneSignal.initialize("624a863f-5157-4806-8b92-e0b5bc351b76");

        // Request push permission
        // const permissionGranted =
        await OneSignal.Notifications.requestPermission(true);
        // console.log("Permission granted:", permissionGranted);
        // alert("Permission granted:" + JSON.stringify(permissionGranted));

        // get playerId
        await OneSignal.User.getOnesignalId()
          .then((playerId) => {
            // alert("🎯 Player ID: " + playerId);
            dispatch(setToken(playerId as string));
          })
          .catch((err) => alert(JSON.stringify(err)));
      } catch (error: any) {
        console.error("🔥 OneSignal init error:", error);
        // alert("OneSignal error: " + (error?.message || JSON.stringify(error)));
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
