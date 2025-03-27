import { Navigate, Outlet } from "react-router-dom";
import { getLoginUser } from "../libs/userUtils";

const PrivateRoute = () => {
  const userInfo = getLoginUser();

  return userInfo ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
