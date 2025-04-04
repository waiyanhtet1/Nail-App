import MyBookingCard from "../../../components/cards/MyBookingCard";

const ActiveBookingCardList = () => {
  return (
    <div className="flex flex-col gap-3 mx-3 overflow-y-scroll h-[calc(100vh-150px)] no-scrollbar mt-3">
      {Array.from({ length: 10 }).map((_, index) => (
        <MyBookingCard key={index} variant="active" />
      ))}
    </div>
  );
};

export default ActiveBookingCardList;
