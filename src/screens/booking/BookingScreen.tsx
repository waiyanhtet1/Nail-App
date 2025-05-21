import CategoryCard from "../../components/cards/CategoryCard";
import Header from "../../components/Header";
import Loading from "../../components/Loading";
import { BASE_URL } from "../../constants/baseUrl";
import { getLoginUser } from "../../libs/userUtils";
import { useAppDispatch, useAppSelector } from "../../redux/hook";
import { setSelectedCategory } from "../../redux/slices/bookingSlice";
import ServiceListSection from "../../sections/bookingSections/ServiceListSection";
import { CategoriesType } from "../../types/types";

interface Props {
  categoriesData: CategoriesType[];
  isLoading: boolean;
}

const BookingScreen = ({ categoriesData, isLoading }: Props) => {
  const dispatch = useAppDispatch();
  const { selectedCategory } = useAppSelector((state) => state.booking);

  const userInfo = getLoginUser();

  return (
    <div>
      <Header />
      {userInfo === null ? (
        <p className="text-sm font-semibold text-center">
          To access booking, you need to login first.
        </p>
      ) : (
        <div className="p-5">
          {selectedCategory === null ? (
            <>
              <p className="text-lg text-secondary font-bold">Categories</p>
              {isLoading ? (
                <Loading />
              ) : (
                <div className="overflow-y-scroll h-[calc(100vh-240px)] no-scrollbar">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-3">
                    {categoriesData &&
                      categoriesData.map((item) => (
                        <CategoryCard
                          key={item.id}
                          icon={`${BASE_URL}${item.icon}`}
                          title={item.name}
                          onClick={() =>
                            dispatch(
                              setSelectedCategory({
                                id: item.id,
                                name: item.name,
                                icon: item.icon,
                              })
                            )
                          }
                        />
                      ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <ServiceListSection />
          )}
        </div>
      )}
    </div>
  );
};

export default BookingScreen;
