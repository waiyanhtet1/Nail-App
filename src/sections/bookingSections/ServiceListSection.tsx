import ServiceCard from "../../components/ServiceCard";
import { useAppSelector } from "../../redux/hook";

const ServiceListSection = () => {
  const { selectedCategory } = useAppSelector((state) => state.booking);
  return (
    <div>
      <div className="flex items-center font-semibold">
        <p className="text-sm text-secondary">
          Categories / {selectedCategory?.name}
        </p>
      </div>
      <p className="text-lg text-secondary font-bold mt-5">Services</p>

      <div className="overflow-y-scroll h-[calc(100vh-320px)] no-scrollbar">
        {Array.from({ length: 10 }).map((_, index) => (
          <ServiceCard key={index} title={`Service ${index + 1}`} />
        ))}
      </div>
    </div>
  );
};

export default ServiceListSection;
