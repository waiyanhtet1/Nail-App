import { IonIcon } from "@ionic/react";
import { checkmarkCircle } from "ionicons/icons";
import { StyleListType } from "../../types/types";
import stylistImg from "/images/stylist.jpeg";

interface Props {
  stylist: StyleListType;
  onClick: () => void;
  selectedArtistId: string;
}

const SelectArtistSection = ({ stylist, onClick, selectedArtistId }: Props) => {
  return (
    <div
      key={stylist._id}
      className="mx-3 flex flex-col gap-1 items-center"
      onClick={onClick}
    >
      <div className="relative w-[70px] h-[80px] rounded-2xl overflow-hidden">
        <img
          src={stylist.image || stylistImg}
          alt=""
          className="w-full h-full object-cover"
        />
        {/* Gradient Overlay */}
        {selectedArtistId === stylist._id && (
          <>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
            <IonIcon
              icon={checkmarkCircle}
              className="absolute bottom-0 size-7 text-white"
            />
          </>
        )}
      </div>
      <p className="text-secondary text-center font-semibold text-sm">
        {stylist.stylistName}
      </p>
    </div>
  );
};

export default SelectArtistSection;
