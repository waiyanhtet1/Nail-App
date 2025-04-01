import CategoryCard from "../components/CategoryCard";
import Header from "../components/Header";
import Loading from "../components/Loading";
import { encodeSvg } from "../libs/imgUtils";
import { useAppDispatch, useAppSelector } from "../redux/hook";
import { setSelectedCategory } from "../redux/slices/bookingSlice";
import ServiceListSection from "../sections/bookingSections/ServiceListSection";
import { CategoriesType } from "../types/types";

interface Props {
  categoriesData: CategoriesType[];
  isLoading: boolean;
}

const BookingScreen = ({ categoriesData, isLoading }: Props) => {
  const dispatch = useAppDispatch();
  const { selectedCategory } = useAppSelector((state) => state.booking);

  return (
    <div>
      <Header />
      <div className="p-5">
        {selectedCategory === null ? (
          <>
            <p className="text-lg text-secondary font-bold">Categories</p>
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
                      onClick={() =>
                        dispatch(
                          setSelectedCategory({
                            selectedCategory: {
                              id: item.id,
                              name: item.name,
                              icon: item.icon,
                            },
                          })
                        )
                      }
                    />
                  ))}
              </div>
            )}
          </>
        ) : (
          <ServiceListSection />
        )}
      </div>
    </div>
  );
};

export default BookingScreen;
