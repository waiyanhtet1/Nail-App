import { IonIcon } from "@ionic/react";

interface Props {
  children: React.ReactNode;
  variant: "primary" | "secondary" | "outline";
  className?: string;
  type: "submit" | "reset" | "button";
  size: "sm" | "md";
  onClick: () => void;
  Icon?: string;
  IconOnClick?: () => void;
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
}: Props) => {
  return (
    <button
      type={type}
      className={`
    ${variant === "primary" && "bg-gray text-white rounded-md"}
    ${
      variant === "outline" &&
      "bg-transparent text-secondary border border-secondary"
    }
    ${variant === "secondary" && "bg-primary-second"}
    ${size === "sm" && "p-2 text-xs"}
    ${size === "md" && "px-3 py-2 text-sm"} 
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
