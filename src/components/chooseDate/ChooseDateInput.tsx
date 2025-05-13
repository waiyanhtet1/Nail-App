import { IonIcon } from "@ionic/react";
import dayjs from "dayjs";
import { chevronBackOutline, chevronForwardOutline } from "ionicons/icons";
import { useEffect, useState } from "react";

const ChooseDateInput = ({
  onDateChange,
  closingDays,
}: {
  onDateChange?: (date: string) => void;
  closingDays: number[];
}) => {
  const today = dayjs();
  const [startOfWeek, setStartOfWeek] = useState(today.startOf("week")); // Sunday as start
  const [selectedDate, setSelectedDate] = useState(today);

  useEffect(() => {
    onDateChange?.(today.format("YYYY-MM-DD"));
  }, []);

  const getWeekDates = () => {
    return Array.from({ length: 7 }, (_, i) => startOfWeek.add(i, "day"));
  };

  const handleNextWeek = () => {
    setStartOfWeek((prev) => prev.add(7, "day"));
  };

  const handlePrevWeek = () => {
    const prevWeekStart = startOfWeek.subtract(7, "day");
    if (prevWeekStart.endOf("week").isBefore(today.startOf("day"))) return;
    setStartOfWeek(prevWeekStart);
  };

  const handleSelectDate = (date: dayjs.Dayjs) => {
    if (date.isBefore(today.startOf("day")) || closingDays.includes(date.day()))
      return;
    setSelectedDate(date);
    onDateChange?.(date.format("YYYY-MM-DD"));
  };

  return (
    <div className="flex flex-col gap-5 items-center">
      {/* Week Navigation */}
      <div className="flex items-center justify-center gap-5">
        <IonIcon
          icon={chevronBackOutline}
          className="size-6 cursor-pointer"
          onClick={handlePrevWeek}
        />
        <p className="font-semibold">
          {startOfWeek.add(6, "day").format("MMMM, YYYY")}
        </p>
        <IonIcon
          icon={chevronForwardOutline}
          className="size-6 cursor-pointer"
          onClick={handleNextWeek}
        />
      </div>

      {/* Week Days */}
      <div className="flex items-center justify-between w-full">
        {getWeekDates().map((date) => {
          const isPast = date.isBefore(today, "day");
          const isClosed = closingDays.includes(date.day());
          const isDisabled = isPast || isClosed;
          const isSelected = date.isSame(selectedDate, "day");

          return (
            <button
              key={date.format("YYYY-MM-DD")}
              className={`text-center w-full h-[60px] rounded-full transition-colors
                ${isSelected ? "bg-secondary text-white" : ""}
                ${
                  isDisabled
                    ? "text-gray-400 cursor-not-allowed"
                    : "hover:bg-blue-100"
                }
              `}
              disabled={isDisabled}
              onClick={() => handleSelectDate(date)}
            >
              <p className="font-semibold text-sm">{date.format("ddd")}</p>
              <p>{date.format("D")}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ChooseDateInput;
