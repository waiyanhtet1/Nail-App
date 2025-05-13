import { BASE_URL } from "../../constants/baseUrl";
import { StyleListType } from "../../types/types";
import stylistImg from "/images/stylist.jpeg";

interface Props {
  stylists: StyleListType[];
}

const StyleListSection = ({ stylists }: Props) => {
  return (
    <div className="px-5">
      {/* title */}
      <div className="flex items-center justify-between text-secondary mb-2">
        <p className="font-bold">Nail Artists</p>
        <p className="text-sm">See All</p>
      </div>

      {/* services list */}
      <div className="mt-3 flex items-center flex-nowrap overflow-x-scroll no-scrollbar">
        {stylists &&
          stylists.map((item) => (
            <div key={item._id} className="mx-3 flex flex-col gap-1">
              <div className="bg-white w-[90px] h-[100px] rounded-full">
                <img
                  src={
                    item.image === "" ? stylistImg : `${BASE_URL}${item.image}`
                  }
                  alt=""
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
              <p className="text-secondary font-semibold text-sm">
                {item.stylistName}
              </p>
            </div>
          ))}
      </div>
    </div>
  );
};

export default StyleListSection;
