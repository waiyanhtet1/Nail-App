import { formatDateString } from "../../libs/dateUtils";
import ActionButton from "../ActionButton";
import Loading from "../Loading";
import priceTagImg from "/images/price-tag.png";

interface Props {
  title: string;
  discount: number;
  promotionStartDate: string;
  promotionEndDate: string;
  onClick: () => void;
  buttonLoading: boolean;
}

const PromotionCard = ({
  title,
  discount,
  promotionStartDate,
  promotionEndDate,
  onClick,
  buttonLoading,
}: Props) => {
  return (
    <div className="bg-white rounded-xl shadow px-5 py-2">
      <div className="flex items-center justify-between gap-5">
        <img
          src={priceTagImg}
          alt=""
          className="w-[60px] h-[60px] object-cover
        "
        />

        {/* info */}
        <div className="flex flex-col gap-1">
          <p className="text-secondary font-semibold">{title}</p>
          <p className="text-xl text-red-900 font-bold">{discount}% Off</p>
          <p className="text-sm">
            Valid Until : {formatDateString(promotionStartDate)} to{" "}
            {formatDateString(promotionEndDate)}{" "}
          </p>
        </div>
      </div>

      <div className="flex justify-end">
        {buttonLoading ? (
          <Loading />
        ) : (
          <ActionButton
            variant="primary"
            size="sm"
            onClick={onClick}
            type="button"
            className="rounded-lg"
          >
            Use Now
          </ActionButton>
        )}
      </div>
    </div>
  );
};

export default PromotionCard;
