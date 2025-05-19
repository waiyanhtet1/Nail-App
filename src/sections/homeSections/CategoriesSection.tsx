import { useEffect, useRef } from "react";
import { BASE_URL } from "../../constants/baseUrl";
import { serviceCategoriesType } from "../../types/types";

interface Props {
  services: serviceCategoriesType[];
}

const CategoriesSection = ({ services }: Props) => {
  const elementRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      if (elementRef.current) {
        const { scrollLeft, clientWidth, scrollWidth } = elementRef.current;

        if (scrollLeft + clientWidth >= scrollWidth) {
          elementRef.current.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          elementRef.current.scrollBy({ left: 200, behavior: "smooth" });
        }
      }
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="px-5 pb-7">
      {/* title */}
      <div className="flex items-center justify-between text-secondary mb-2">
        <p className="font-bold">Categories</p>
        {/* <p className="text-sm">See All</p> */}
      </div>

      {/* services list */}
      <div
        className="mt-3 flex items-center flex-nowrap overflow-x-scroll no-scrollbar"
        ref={elementRef}
      >
        {services &&
          services.map((item) => (
            <div
              key={item._id}
              className="mx-3 flex flex-col gap-1 items-center"
            >
              <div className="bg-white w-[60px] h-[60px] rounded-full">
                <img
                  src={`${BASE_URL}${item.categoryIcon}`}
                  alt=""
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
              <p className="text-secondary text-xs font-semibold">
                {item.categoryName.substring(0, 8)}
              </p>
            </div>
          ))}
      </div>
    </div>
  );
};

export default CategoriesSection;
