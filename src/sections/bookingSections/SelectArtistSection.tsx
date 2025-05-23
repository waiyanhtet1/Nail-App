import { IonIcon } from "@ionic/react";
import { closeCircleOutline } from "ionicons/icons";
import { BASE_URL } from "../../constants/baseUrl";
import { useAppDispatch, useAppSelector } from "../../redux/hook";
import {
  initializePersonArray,
  removeStylist,
} from "../../redux/slices/personCountSlice";
import { StyleListType } from "../../types/types";
import stylistImg from "/images/stylist.jpeg";

interface Props {
  stylist: StyleListType;
  onClick: () => void;
  personCountInput: number;
}

const SelectArtistSection = ({ stylist, onClick, personCountInput }: Props) => {
  const dispatch = useAppDispatch();
  const personCount = useAppSelector((state) => state.personCount);

  // Check if this stylist is selected
  const currentPerson = personCount.find(
    (item) => item.stylistId === stylist._id
  );

  const isSelected = Boolean(currentPerson);

  const handleRemoveSelected = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(removeStylist(stylist._id));
    dispatch(initializePersonArray(personCountInput));
  };

  return (
    <div
      key={stylist._id}
      className="mx-3 flex flex-col gap-1 relative"
      onClick={onClick}
    >
      {isSelected && (
        <div
          className="absolute top-0 right-0 z-50"
          onClick={handleRemoveSelected}
        >
          <IonIcon icon={closeCircleOutline} className="size-6 text-red-500" />
        </div>
      )}

      <div className="relative w-[70px] h-[80px] rounded-2xl overflow-hidden">
        <img
          src={
            stylist.image === "" ? stylistImg : `${BASE_URL}${stylist.image}`
          }
          alt=""
          className="w-full h-full object-cover"
        />

        {/* Show overlay if stylist is selected (exists in personCount) */}
        {isSelected && (
          <>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
            <span className="absolute bottom-1 text-xs w-full text-center text-white">
              Person {currentPerson?.id}
            </span>
          </>
        )}
      </div>
      <p className="text-secondary font-semibold text-sm">
        {stylist.stylistName}
      </p>
    </div>
  );
};

export default SelectArtistSection;
