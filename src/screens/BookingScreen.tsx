import CategoryCard from "../components/CategoryCard";
import Header from "../components/Header";
import img from "/images/category.png";

const BookingScreen = () => {
  return (
    <div>
      <Header />
      <div className="p-5">
        <p className="text-secondary font-bold">Categories</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-3 overflow-y-scroll h-[calc(100vh-290px)] no-scrollbar">
          <CategoryCard icon={img} title="Nail Services" />
          <CategoryCard icon={img} title="Nail Services" />
          <CategoryCard icon={img} title="Nail Services" />
          <CategoryCard icon={img} title="Nail Services" />
          <CategoryCard icon={img} title="Nail Services" />
          <CategoryCard icon={img} title="Nail Services" />
          <CategoryCard icon={img} title="Nail Services" />
          <CategoryCard icon={img} title="Nail Services" />
          <CategoryCard icon={img} title="Nail Services" />
          <CategoryCard icon={img} title="Nail Services" />
          <CategoryCard icon={img} title="Nail Services" />
        </div>
      </div>
    </div>
  );
};

export default BookingScreen;
