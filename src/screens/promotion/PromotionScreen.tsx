import PromotionCard from "../../components/cards/PromotionCard";

const PromotionScreen = () => {
  return (
    <div className="mt-15 mx-5">
      <p className="text-secondary text-lg mb-5 font-bold">Promotion</p>

      <div className="overflow-y-scroll h-[calc(100vh-180px)] no-scrollbar flex flex-col gap-3">
        {Array.from({ length: 10 }).map((_, index) => (
          <PromotionCard
            key={index}
            title={`Thingyan Festival Promo ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default PromotionScreen;
