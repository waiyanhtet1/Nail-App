import CategoryCard from "../components/CategoryCard";
import Header from "../components/Header";
import Loading from "../components/Loading";
import { encodeSvg } from "../libs/imgUtils";
import { CategoriesType } from "../types/types";

interface Props {
  categoriesData: CategoriesType[];
  isLoading: boolean;
}

const BookingScreen = ({ categoriesData, isLoading }: Props) => {
  return (
    <div>
      <Header />
      <div className="p-5">
        <p className="text-secondary font-bold">Categories</p>
        {isLoading ? (
          <Loading />
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-3 overflow-y-scroll h-[calc(100vh-290px)] no-scrollbar">
            {categoriesData &&
              categoriesData.map((item) => (
                <CategoryCard
                  key={item.id}
                  icon={encodeSvg(item.icon)}
                  title={item.name}
                />
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingScreen;
