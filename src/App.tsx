import { PushNotifications } from "@capacitor/push-notifications";
import { setupIonicReact } from "@ionic/react";
import "@ionic/react/css/core.css";
import { useEffect } from "react";
import {
  Route,
  BrowserRouter as Router,
  Routes,
  useLocation,
} from "react-router-dom"; // Import BrowserRouter
import { CSSTransition, TransitionGroup } from "react-transition-group"; // Import transition components
import AppBackButtonHandler from "./AppBackButtonHandler";
import { getToken, messaging } from "./firebase/firebase-config";
import MainLayout from "./layouts/MainLayout";
import LoginScreen from "./screens/auth/LoginScreen";
import RegisterScreen from "./screens/auth/RegisterScreen";
import AddBookingScreen from "./screens/booking/AddBookingScreen";
import BookingConfirmScreen from "./screens/booking/BookingConfirmScreen";
import MyBookingScreen from "./screens/booking/myBooking/MyBookingScreen";
import ChatHomeScreen from "./screens/chat/ChatHomeScreen";
import ChattingScreen from "./screens/chat/ChattingScreen";
import EditProfile from "./screens/profile/EditProfile";
import MyStamps from "./screens/profile/MyStamps";
import ProfileScreen from "./screens/profile/ProfileScreen";

setupIonicReact();

const App = () => {
  const location = useLocation();

  useEffect(() => {
    PushNotifications.requestPermissions().then((result) => {
      if (result.receive === "granted") {
        PushNotifications.register();
      }
    });

    PushNotifications.addListener("registration", async () => {
      try {
        const token = await getToken(messaging, {
          vapidKey:
            "BIHYZXilGAZoB9gMe945V4kvGSbUoZWhrwhtx51RGhYgaUd3bLXrNzZUMOAIFY3irbokj70cKO0rK072WXW1FV8", // Only needed for web
        });
        console.log("FCM Token:", token);
      } catch (err) {
        console.error("Error getting token:", err);
      }
    });

    PushNotifications.addListener("registrationError", (err) => {
      console.error("Registration error:", err);
    });

    PushNotifications.addListener(
      "pushNotificationReceived",
      (notification) => {
        console.log("Push received:", notification);
      }
    );

    PushNotifications.addListener(
      "pushNotificationActionPerformed",
      (notification) => {
        console.log("Push action performed:", notification);
      }
    );
  }, []);

  return (
    <>
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
              {/* booking screens */}
              <Route path="/add-booking" element={<AddBookingScreen />} />
              <Route
                path="confirm-booking"
                element={<BookingConfirmScreen />}
              />
              {/* profile screens */}
              <Route path="/profile" element={<ProfileScreen />} />
              <Route path="/profile/edit" element={<EditProfile />} />
              <Route path="/profile/booking" element={<MyBookingScreen />} />
              <Route path="/profile/my-stamps" element={<MyStamps />} />

              {/* chat screens */}
              <Route path="/chat-home" element={<ChatHomeScreen />} />
              <Route path="/chat" element={<ChattingScreen />} />
            </Routes>
          </div>
        </CSSTransition>
      </TransitionGroup>
    </>
  );
};

export default function Wrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}
