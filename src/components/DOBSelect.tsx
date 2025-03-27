import { IonIcon } from "@ionic/react";
import { chevronDownOutline } from "ionicons/icons";
import { useState } from "react";

interface DOBInterface {
  day: string;
  setDay: (value: string) => void;
  month: string;
  setMonth: (value: string) => void;
  year: string;
  setYear: (value: string) => void;
}

type OptionType = {
  value: string;
  label: string;
};

interface SelectInputProps {
  options: OptionType[];
  selected: string;
  setSelected: (value: string) => void;
  previewLabel: string;
}

const SelectInput = ({
  options,
  selected,
  setSelected,
  previewLabel,
}: SelectInputProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (value: string) => {
    setSelected(value);
    setIsOpen(false);
  };

  return (
    <div className="relative w-32">
      <button
        type="button"
        className="w-full bg-white rounded-xl border-gray-300 p-3 flex justify-between items-center shadow"
        onClick={() => setIsOpen(!isOpen)}
      >
        {selected ? (
          options.find((opt) => opt.value === selected)?.label
        ) : (
          <p className="text-sm text-gray-second">{previewLabel}</p>
        )}
        <IonIcon icon={chevronDownOutline} className="text-gray-500" />
      </button>
      {isOpen && (
        <div className="absolute left-0 w-full bg-white border border-gray-300 mt-2 rounded-md shadow-lg z-50 max-h-40 overflow-y-auto">
          <ul>
            {options.map((option) => (
              <li
                key={option.value}
                className="p-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleSelect(option.value)}
              >
                {option.label}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

const DOBSelect = ({
  day,
  setDay,
  month,
  setMonth,
  year,
  setYear,
}: DOBInterface) => {
  const days = Array.from({ length: 31 }, (_, i) => ({
    value: (i + 1).toString(),
    label: (i + 1).toString(),
  }));
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ].map((month, i) => ({ value: (i + 1).toString(), label: month }));
  const years = Array.from({ length: 100 }, (_, i) => {
    const year = (new Date().getFullYear() - i).toString();
    return { value: year, label: year };
  });

  return (
    <div className="flex gap-2">
      <SelectInput
        options={days}
        selected={day}
        setSelected={setDay}
        previewLabel="Day"
      />
      <SelectInput
        options={months}
        selected={month}
        setSelected={setMonth}
        previewLabel="Month"
      />
      <SelectInput
        options={years}
        selected={year}
        setSelected={setYear}
        previewLabel="Year"
      />
    </div>
  );
};

export default DOBSelect;
