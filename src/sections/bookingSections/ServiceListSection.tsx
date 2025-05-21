import { IonIcon } from "@ionic/react";
import axios from "axios";
import { arrowBackOutline } from "ionicons/icons";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Loading from "../../components/Loading";
import ServiceCard from "../../components/cards/ServiceCard";
import { BASE_URL } from "../../constants/baseUrl";
import { useAppDispatch, useAppSelector } from "../../redux/hook";
import {
  setSelectedCategory,
  setSelectedService,
} from "../../redux/slices/bookingSlice";
import { ServiceType } from "../../types/types";

const ServiceListSection = () => {
  const { selectedCategory } = useAppSelector((state) => state.booking);
  const [isLoading, setIsLoading] = useState(false);
  const [servicesData, setServicesData] = useState<ServiceType[]>([]);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const getServicesData = async () => {
      setIsLoading(true);
      try {
        const { data } = await axios.get(
          `${BASE_URL}/services/category/${selectedCategory?.id}`
        );
        setServicesData(data);
      } catch (error) {
        console.log(error);
      }
      setIsLoading(false);
    };

    getServicesData();
  }, [selectedCategory]);

  return (
    <div>
      <div className="flex items-center gap-3 font-semibold">
        <IonIcon
          icon={arrowBackOutline}
          className="size-5"
          onClick={() => dispatch(setSelectedCategory(null))}
        />
        <p className="text-sm text-secondary">
          Categories / {selectedCategory?.name}
        </p>
      </div>
      <p className="text-lg text-secondary font-bold mt-5">Services</p>

      {isLoading ? (
        <Loading />
      ) : (
        <div className="overflow-y-scroll h-[calc(100vh-290px)] no-scrollbar">
          {servicesData && servicesData.length === 0 ? (
            <p className="text-sm text-center font-semibold">No Result</p>
          ) : (
            servicesData.map((item) => (
              <ServiceCard
                key={item._id}
                serviceName={item.serviceName}
                serviceName_mm={item.serviceName_mm}
                serviceDescription={item.serviceDescription}
                serviceDescription_mm={item.serviceDescription_mm}
                servicePrice={item.servicePrice}
                onClick={() => {
                  dispatch(setSelectedService(item));
                  navigate("/add-booking");
                }}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default ServiceListSection;
