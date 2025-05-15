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
  className = "",
  type,
  onClick,
  leftIcon,
  rightIcon,
}: Props) => {
  return (
    <button
      style={{
        all: "unset",
        backgroundImage: "linear-gradient(to right, #B0CCDF, #DCB8B0)",
        color: "black",
        padding: "10px 20px",
        borderRadius: "20px",
        display: "inline-block",
        textAlign: "center",
        width: "100%",
      }}
      className={`transition-all ease-in-out duration-300 active:shadow-lg active:text-gray-600 ${
        variant === "primary" ? "font-bold" : ""
      } ${className}`}
      type={type}
      onClick={onClick}
    >
      <div
        className={`w-full ${
          leftIcon || rightIcon ? "flex items-center justify-between px-5" : ""
        }`}
      >
        {leftIcon && <IonIcon icon={leftIcon} className="size-5" />}
        {children}
        {rightIcon && <IonIcon icon={rightIcon} className="size-5" />}
      </div>
    </button>
  );
};

export default Button;
