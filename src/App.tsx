import { setupIonicReact } from "@ionic/react";
import "@ionic/react/css/core.css";
import {
  Route,
  BrowserRouter as Router,
  Routes,
  useLocation,
} from "react-router-dom"; // Import BrowserRouter
import { CSSTransition, TransitionGroup } from "react-transition-group"; // Import transition components
import AppBackButtonHandler from "./AppBackButtonHandler";
import MainLayout from "./layouts/MainLayout";
import LoginScreen from "./screens/auth/LoginScreen";
import RegisterScreen from "./screens/auth/RegisterScreen";
import AddBookingScreen from "./screens/booking/AddBookingScreen";
import BookingConfirmScreen from "./screens/booking/BookingConfirmScreen";
import MyBookingScreen from "./screens/booking/MyBookingScreen";
import EditProfile from "./screens/profile/EditProfile";
import ProfileScreen from "./screens/profile/ProfileScreen";

setupIonicReact();

const App = () => {
  const location = useLocation();

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
