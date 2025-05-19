import { IonIcon } from "@ionic/react";
import axios from "axios";
import { arrowBackOutline } from "ionicons/icons";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import StylistCard from "../../components/cards/StylistCard";
import Loading from "../../components/Loading";
import { BASE_URL } from "../../constants/baseUrl";
import { StylistType } from "../../types/stylistType";

const AllStylistScreen = () => {
  const navigate = useNavigate();
  const [stylists, setStylists] = useState<StylistType[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const getStylistData = async () => {
    setIsLoading(true);
    try {
      const { data } = await axios.get(`${BASE_URL}/admin/stylists`);
      console.log(data);
      setStylists(data);
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    getStylistData();
  }, []);

  return (
    <>
      <div className="h-max rounded-b-[2.5rem] bg-primary shadow-lg p-5">
        <div className="flex items-center gap-3 mt-10">
          {/* back and title */}
          <IonIcon
            icon={arrowBackOutline}
            className="size-6"
            onClick={() => navigate(-1)}
          />
          <p className="text-secondary font-bold">Nail Artists</p>
        </div>
      </div>

      {isLoading ? (
        <Loading />
      ) : (
        <div className="mx-5 md:mx-20 overflow-y-scroll h-[calc(100vh-110px)] no-scrollbar">
          <p className="font-semibold text-secondary text-xl my-5">
            Nail Artists{" "}
            <span className="text-red-800">
              ({stylists && stylists.length})
            </span>
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-5 md:place-self-center">
            {stylists &&
              stylists.map((item) => (
                <StylistCard
                  key={item.id}
                  name={item.stylistName}
                  position={item.position}
                  image={item.image}
                />
              ))}
          </div>
        </div>
      )}
    </>
  );
};

export default AllStylistScreen;
