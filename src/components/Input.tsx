import { IonIcon } from "@ionic/react";

interface Props {
  type: string;
  label: string;
  Icon?: string;
  IconOnClick?: () => void;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
  isBorderRed?: boolean;
  errorMessage?: string;
  value?: string;
  setValue?: (value: string) => void;
  isBorder?: boolean;
}

const Input = ({
  type,
  label,
  Icon,
  IconOnClick,
  inputProps,
  isBorderRed,
  errorMessage,
  value,
  setValue,
  isBorder,
}: Props) => {
  return (
    <div>
      <div className="flex items-center justify-between">
        <p className="text-gray">{label}</p>
        <p className="text-red-500 text-xs">{errorMessage}</p>
      </div>
      <div
        className={`p-3 bg-white rounded-lg flex items-center gap-2 ${
          isBorderRed && "border border-red-500"
        } ${isBorder && "border border-secondary"} shadow`}
      >
        <input
          type={type}
          defaultValue={value}
          onChange={(e) => setValue && setValue(e.target.value)}
          className="w-full text-base outline-none"
          {...inputProps}
        />
        {Icon && (
          <IonIcon icon={Icon} className="size-6" onClick={IconOnClick} />
        )}
      </div>
    </div>
  );
};

export default Input;
