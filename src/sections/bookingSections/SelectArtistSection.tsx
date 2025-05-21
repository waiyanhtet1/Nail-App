import { BASE_URL } from "../../constants/baseUrl";
import { useAppSelector } from "../../redux/hook";
import { StyleListType } from "../../types/types";
import stylistImg from "/images/stylist.jpeg";

interface Props {
  stylist: StyleListType;
  onClick: () => void;
}

const SelectArtistSection = ({ stylist, onClick }: Props) => {
  const personCount = useAppSelector((state) => state.personCount);

  // Check if this stylist is selected
  const currentPerson = personCount.find(
    (item) => item.stylistId === stylist._id
  );

  const isSelected = Boolean(currentPerson);

  return (
    <div
      key={stylist._id}
      className="mx-3 flex flex-col gap-1"
      onClick={onClick}
    >
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
