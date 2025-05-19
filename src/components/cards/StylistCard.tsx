import stylistImage from "/images/stylist.jpeg";

interface Props {
  name: string;
}

const StylistCard = ({ name }: Props) => {
  return (
    <div className="flex flex-col">
      <img
        src={stylistImage}
        alt=""
        className="w-full h-[150px] object-cover rounded-xl"
      />
      <div>
        <p className="font-semibold">{name}</p>
        <p className="font-light">Senior Nail Artist</p>
      </div>
    </div>
  );
};

export default StylistCard;
