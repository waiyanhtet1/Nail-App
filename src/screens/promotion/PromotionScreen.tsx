import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PromotionCard from "../../components/cards/PromotionCard";
import { BASE_URL } from "../../constants/baseUrl";
import { useAppDispatch } from "../../redux/hook";
import {
  setSelectedCategory,
  setSelectedService,
} from "../../redux/slices/bookingSlice";
import { ServiceType } from "../../types/types";
import discountImg from "/images/discount.png";

interface Props {
  promotions: ServiceType[];
}

const PromotionScreen = ({ promotions }: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const getCategoryDetail = async (serviceId: string) => {
    setIsLoading(true);
    try {
      const { data } = await axios.get(
        `${BASE_URL}/admin/services/${serviceId}`
      );
      const result = data.serviceCategory;
      dispatch(
        setSelectedCategory({
          id: result._id,
          name: result.categoryName,
          icon: result.categoryIcon,
        })
      );

      if (result) {
        navigate("/add-booking");
      }
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };

  const handlePromotionClick = async (item: ServiceType) => {
    dispatch(setSelectedService(item));
    await getCategoryDetail(item._id);
  };

  return (
    <div className="mt-15 mx-5">
      <p className="text-secondary text-lg mb-5 font-bold">Promotion</p>

      <div className="overflow-y-scroll h-[calc(100vh-180px)] no-scrollbar flex flex-col gap-3">
        {promotions.length === 0 ? (
          <div className="flex flex-col">
            <img
              src={discountImg}
              className="w-full h-[250px] object-contain"
            />
            <p className="text-lg text-center text-secondary font-bold">
              No Promotion For Now.
            </p>
          </div>
        ) : (
          promotions.map((item) => (
            <PromotionCard
              key={item._id}
              title={item.promotionName}
              discount={item.promotionDiscount}
              promotionStartDate={item.promotionStartDate}
              promotionEndDate={item.promotionEndDate}
              onClick={() => handlePromotionClick(item)}
              buttonLoading={isLoading}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default PromotionScreen;
