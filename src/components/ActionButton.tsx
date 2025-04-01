interface Props {
  children: React.ReactNode;
  variant: "primary" | "outline";
  className?: string;
  type: "submit" | "reset" | "button";
  size: "sm" | "md";
  onClick: () => void;
}
const ActionButton = ({
  children,
  variant,
  className,
  type,
  size,
  onClick,
}: Props) => {
  return (
    <button
      type={type}
      className={`
    ${variant === "primary" && "bg-gray text-white"}
    ${
      variant === "outline" &&
      "bg-transparent text-secondary border border-secondary"
    }
    ${size === "sm" && "p-2 text-xs"}
    rounded-md whitespace-nowrap
    ${className}
    `}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default ActionButton;
