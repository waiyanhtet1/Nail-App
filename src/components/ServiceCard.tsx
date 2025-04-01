import ActionButton from "./ActionButton";

interface Props {
  serviceName: string;
  serviceName_mm: string;
  serviceDescription: string;
  serviceDescription_mm: string;
  servicePrice: number;
}

const ServiceCard = ({
  serviceName,
  serviceName_mm,
  serviceDescription,
  serviceDescription_mm,
  servicePrice,
}: Props) => {
  return (
    <div className="mt-3 bg-white flex flex-col gap-3 p-3 rounded-xl">
      <div className="flex items-center justify-between font-bold">
        <p className="text-sm">
          {serviceName} {serviceName_mm}
        </p>
        <p className="text-sm">{servicePrice.toLocaleString()} KS</p>
      </div>

      <div className="flex items-center justify-between gap-1">
        <p className="text-sm">
          {serviceDescription} {serviceDescription_mm}
        </p>
        <ActionButton variant="primary" size="sm" type="button">
          Book Now
        </ActionButton>
      </div>
    </div>
  );
};

export default ServiceCard;
