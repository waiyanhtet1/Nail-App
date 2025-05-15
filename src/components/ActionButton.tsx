import { IonIcon } from "@ionic/react";

interface Props {
  children: React.ReactNode;
  variant: "primary" | "secondary" | "outline" | "error";
  className?: string;
  type: "submit" | "reset" | "button";
  size: "sm" | "md";
  onClick: () => void;
  Icon?: string;
  IconOnClick?: () => void;
  disabled?: boolean;
}
const ActionButton = ({
  children,
  variant,
  className,
  type,
  size,
  onClick,
  Icon,
  IconOnClick,
  disabled,
}: Props) => {
  return (
    <button
      type={type}
      className={`
    ${variant === "primary" && !disabled && "bg-gray text-white "}
    ${
      variant === "outline" &&
      !disabled &&
      "bg-white text-secondary border border-secondary"
    }
    ${variant === "secondary" && !disabled && "bg-primary-second"}
    ${variant === "error" && !disabled && "bg-red-primary text-primary "}
    ${size === "sm" && "p-2 text-xs"}
    ${size === "md" && "px-3 py-2 text-sm"} 
       ${disabled && "bg-primary-second text-gray-500 cursor-not-allowed"}
    whitespace-nowrap flex items-center justify-center font-semibold
    ${className}
    `}
      onClick={onClick}
    >
      <div className="flex items-center gap-1">
        {Icon && (
          <IonIcon
            icon={Icon}
            className={`size-5 
            ${variant === "primary" && "text-white"} 
            ${variant === "outline" && "text-gray"} 
            `}
            onClick={IconOnClick}
          />
        )}
        {children}
      </div>
    </button>
  );
};

export default ActionButton;
