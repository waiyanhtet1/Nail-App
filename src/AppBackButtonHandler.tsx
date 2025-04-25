/* eslint-disable @typescript-eslint/no-explicit-any */
import { App } from "@capacitor/app";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AppBackButtonHandler = () => {
  const navigate = useNavigate();

  useEffect(() => {
    let backButtonListener: any;

    const setupBackButtonListener = async () => {
      backButtonListener = await App.addListener("backButton", () => {
        navigate(-1); // Always go back
      });
    };

    setupBackButtonListener();

    return () => {
      if (
        backButtonListener &&
        typeof backButtonListener.remove === "function"
      ) {
        backButtonListener.remove();
      }
    };
  }, [navigate]);

  return null;
};

export default AppBackButtonHandler;
