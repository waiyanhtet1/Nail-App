import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ActionButton from "../../components/ActionButton";
import { BASE_URL } from "../../constants/baseUrl";
import { formatDateString } from "../../libs/dateUtils";
import { useAppSelector } from "../../redux/hook";

const SuccessBookingDetail = () => {
  const navigate = useNavigate();
  const { selectedBooking, selectedService } = useAppSelector(
    (state) => state.booking
  );

  const [stylistNames, setStylistNames] = useState<string[]>([]);

  useEffect(() => {
    const fetchStylists = async () => {
      if (!selectedBooking?.bookingData) return;

      try {
        const promises = selectedBooking.bookingData.map((item) =>
          axios.get(`${BASE_URL}/admin/stylists/${item.stylistId}`)
        );

        const responses = await Promise.all(promises);
        const names = responses.map((res) => res.data.stylistName);
        setStylistNames(names);
      } catch (err) {
        console.error("Error fetching stylists:", err);
      }
    };

    fetchStylists();
  }, [selectedBooking?.bookingData]);

  return (
    <div className="flex flex-col gap-3 mt-20 mx-5">
      <Item
        title="Booking Date & Time : "
        value={formatDateString(selectedBooking?.date as string)}
      />
      <Item title="Stylist Name : " value={stylistNames.join(", ")} />
      <Item
        title="Number of Person : "
        value={selectedBooking?.bookingData.length.toString() as string}
      />

      <p className="text-lg font-semibold">Service</p>

      {/* service list */}
      <Item
        title={`${selectedService?.serviceName} / ${selectedService?.serviceName_mm}`}
        value={`${
          selectedBooking &&
          selectedService &&
          selectedService?.servicePrice.toLocaleString()
        } KS`}
      />

      <hr className="my-3 text-gray-fourth" />

      {/* subtotal and discount */}
      {selectedService?.isPromotionService && (
        <>
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <p>Sub-Total</p>
              <p>
                {selectedBooking &&
                  selectedService &&
                  (
                    selectedService?.servicePrice *
                    selectedBooking?.bookingData.length
                  ).toLocaleString()}{" "}
                KS
              </p>
            </div>
            <div className="flex items-center justify-between mt-3">
              <p>Promotion Discount</p>
              <p>{selectedService.promotionDiscount}% Off</p>
            </div>
          </div>
          <hr className="my-5 text-gray-fourth" />
        </>
      )}

      {/* <Item
        title="Total Coast"
        value={`${
          selectedBooking &&
          selectedService &&
          (
            selectedService?.servicePrice * selectedBooking?.bookingData.length
          ).toLocaleString()
        }
          KS`}
      /> */}
      {/* total cost */}
      <div className="flex items-center justify-between">
        <p>Total Cost</p>
        {selectedService?.isPromotionService ? (
          <p>
            {selectedBooking &&
              selectedService &&
              (
                selectedService?.promotionPrice *
                selectedBooking?.bookingData.length
              ).toLocaleString()}
            KS
          </p>
        ) : (
          <p>
            {selectedBooking &&
              selectedService &&
              (
                selectedService?.servicePrice *
                selectedBooking?.bookingData.length
              ).toLocaleString()}{" "}
            KS
          </p>
        )}
      </div>

      <ActionButton
        variant="outline"
        type="button"
        size="md"
        className="w-full rounded-xl py-3 font-bold mt-5"
        onClick={() => navigate("/")}
      >
        Back To Home Screen
      </ActionButton>
    </div>
  );
};

export default SuccessBookingDetail;

interface ItemProps {
  title: string;
  value: string;
}

const Item = ({ title, value }: ItemProps) => {
  return (
    <div className="flex items-center justify-between">
      <p>{title}</p>
      <p className="text-right">{value}</p>
    </div>
  );
};
