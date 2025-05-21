import stampImg from "/images/logo.png";

interface Props {
  isStamped?: boolean;
  isRedColor?: boolean;
  stampNumber: string;
}

const StampCard = ({ isStamped, isRedColor, stampNumber }: Props) => {
  return (
    <div
      className={`w-[40px] h-[50px] rounded-tl-3xl rounded-tr-3xl rounded-bl-lg rounded-br-lg
    flex items-center justify-center ${
      isRedColor ? "bg-red-primary" : "border border-gray-second"
    }`}
    >
      {isStamped ? (
        <img src={stampImg} className="w-full h-full object-contain" />
      ) : (
        <p className={`font-bold text-secondary ${isRedColor && "text-white"}`}>
          {stampNumber}
        </p>
      )}
    </div>
  );
};

export default StampCard;
