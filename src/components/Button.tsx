import { IonIcon } from "@ionic/react";

interface Props {
  children: React.ReactNode;
  variant: "primary";
  className?: string;
  type: "submit" | "reset" | "button";
  onClick?: () => void;
  leftIcon?: string;
  rightIcon?: string;
}

const Button = ({
  children,
  variant,
  className,
  type,
  onClick,
  leftIcon,
  rightIcon,
}: Props) => {
  return (
    <button
      className={`w-full p-3 rounded-full transition-all ease-in-out duration-300 ${
        variant === "primary" &&
        "bg-gradient-to-r from-[#B0CCDF] to-[#DCB8B0] font-bold"
      } active:shadow-lg active:text-gray-600 ${className}`}
      type={type}
      onClick={onClick}
    >
      <div
        className={
          (leftIcon || rightIcon) && "flex items-center justify-between px-5"
        }
      >
        {leftIcon && <IonIcon icon={leftIcon} className="size-5" />}
        {children}
        {rightIcon && <IonIcon icon={rightIcon} className="size-5" />}
      </div>
    </button>
  );
};

export default Button;
