import ActionButton from "../ActionButton";
import promotionImg from "/images/promotion.jpg";

interface Props {
  title: string;
}

const PromotionCard = ({ title }: Props) => {
  return (
    <div className="bg-white rounded-xl shadow px-5 py-2">
      <div className="flex items-center justify-between gap-5">
        <img
          src={promotionImg}
          alt=""
          className="w-[80px] h-[80px] object-cover
          border border-secondary rounded-full"
        />

        {/* info */}
        <div className="flex flex-col gap-1">
          <p className="text-secondary font-semibold">{title}</p>
          <p className="text-xl text-red-900 font-bold">50% Off</p>
          <p className="text-sm">Valid Until : 01.03.2025 to 05.03.2025 </p>
        </div>
      </div>

      <div className="flex justify-end">
        <ActionButton
          variant="primary"
          size="sm"
          onClick={() => console.log("first")}
          type="button"
          className=""
        >
          Use Now
        </ActionButton>
      </div>
    </div>
  );
};

export default PromotionCard;
