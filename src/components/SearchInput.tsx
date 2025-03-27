import { IonIcon } from "@ionic/react";
import { searchOutline } from "ionicons/icons";

const SearchInput = () => {
  return (
    <div className="border rounded-lg border-gray-fourth p-2 flex items-center gap-3">
      <IonIcon icon={searchOutline} className="size-5" />
      <input type="text" className="outline-none text-sm w-full" />
    </div>
  );
};

export default SearchInput;
