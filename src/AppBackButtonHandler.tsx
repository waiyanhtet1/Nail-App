/* eslint-disable @typescript-eslint/no-explicit-any */
import { App } from "@capacitor/app";
import { Dialog } from "@capacitor/dialog";
import { useEffect } from "react";

const AppBackButtonHandler = () => {
  useEffect(() => {
    let backButtonListener: any;

    const addBackButtonListener = async () => {
      backButtonListener = await App.addListener("backButton", async () => {
        const confirmExit = await Dialog.confirm({
          title: "Exit App",
          message: "Are you sure you want to exit?",
        });

        if (confirmExit.value) {
          App.exitApp(); // Close the app
        }
      });
    };

    addBackButtonListener();

    return () => {
      if (backButtonListener) {
        backButtonListener.remove();
      }
    };
  }, []);

  return null;
};

export default AppBackButtonHandler;
