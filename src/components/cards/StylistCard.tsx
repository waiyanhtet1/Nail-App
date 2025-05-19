import { BASE_URL } from "../../constants/baseUrl";
import stylistImage from "/images/stylist.jpeg";

interface Props {
  name: string;
  position: string;
  image: string;
}

const StylistCard = ({ name, position, image }: Props) => {
  return (
    <div className="flex flex-col">
      <img
        src={image === "" ? stylistImage : `${BASE_URL}${image}`}
        alt=""
        className="w-full h-[150px] object-cover rounded-xl"
      />
      <div>
        <p className="font-semibold">{name}</p>
        <p className="font-light">{position}</p>
      </div>
    </div>
  );
};

export default StylistCard;
