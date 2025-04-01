import ActionButton from "./ActionButton";

interface Props {
  title: string;
}

const ServiceCard = ({ title }: Props) => {
  return (
    <div className="mt-3 bg-white flex flex-col gap-3 p-3 rounded-xl">
      <div className="flex items-center justify-between font-bold">
        <p>{title}</p>
        <p className="">60000 ks</p>
      </div>

      <div className="flex items-center justify-between gap-1">
        <p className="text-sm">
          Nail shaping, cuticle treatment, hydration & shining buff
        </p>
        <ActionButton variant="primary" size="sm" type="button">
          Book Now
        </ActionButton>
      </div>
    </div>
  );
};

export default ServiceCard;
