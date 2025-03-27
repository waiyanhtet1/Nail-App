import { decryptData } from "./encryption";

export function getLoginUser() {
  const storedData = localStorage.getItem("userInfo");
  return storedData ? decryptData(storedData) : null;
}
