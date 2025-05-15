import { IonIcon } from "@ionic/react";

interface Props {
  type: string;
  label: string;
  Icon?: string;
  IconOnClick?: () => void;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
  isBorderRed?: boolean;
  errorMessage?: string;
}

const Input = ({
  type,
  label,
  Icon,
  IconOnClick,
  inputProps,
  isBorderRed,
  errorMessage,
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
        } shadow`}
      >
        <input
          type={type}
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
