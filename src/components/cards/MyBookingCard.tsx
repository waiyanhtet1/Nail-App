import { formatDateTimeString } from "../../libs/dateUtils";
import ActionButton from "../ActionButton";
import image from "/images/category.png";

interface Props {
  variant: "active" | "completed" | "cancel";
  serviceName: string;
  bookingCreatedDate?: string;
}

const MyBookingCard = ({ variant, serviceName, bookingCreatedDate }: Props) => {
  return (
    <div className="bg-white rounded-xl p-3">
      {variant === "active" && (
        <>
          <p className="text-sm text-secondary font-bold">
            {formatDateTimeString(bookingCreatedDate as string)}
          </p>
          <hr className="text-gray-fifth my-3" />
        </>
      )}

      {/* info */}
      <div className="flex items-center justify-between gap-3">
        {/* image */}
        <img
          src={image}
          alt=""
          className="w-[60px] h-[50px] rounded-xl bg-primary object-cover"
        />

        {/* title and description */}
        <div className="">
          <p className="text-sm font-semibold">{serviceName}</p>
          <p className="text-sm mt-1">
            Lorem ipsum dolor sit amet consectetur adipisicing.
          </p>
        </div>

        {/* price */}
        <p className="whitespace-nowrap text-sm font-bold self-start">
          0,000 KS
        </p>
      </div>

      {/* action buttons */}
      {variant === "cancel" ? (
        <ActionButton
          variant="primary"
          type="button"
          size="sm"
          className="rounded-xl w-full mt-3"
          onClick={() => console.log("first")}
        >
          Re-Book
        </ActionButton>
      ) : (
        <div className="flex items-center gap-5 mt-3">
          <ActionButton
            variant="secondary"
            type="button"
            size="sm"
            className="rounded-xl w-full"
            onClick={() => console.log("first")}
          >
            {variant === "active" && "Pending"}
            {variant === "completed" && "Re-Book"}
          </ActionButton>
          <ActionButton
            variant="primary"
            type="button"
            size="sm"
            className="rounded-xl w-full"
            onClick={() => console.log("first")}
          >
            {variant === "active" && "View Booking Detail"}
            {variant === "completed" && "Write Review"}
          </ActionButton>
        </div>
      )}
    </div>
  );
};

export default MyBookingCard;
