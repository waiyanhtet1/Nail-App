interface Props {
  children: React.ReactNode;
  variant: "primary";
  className?: string;
  type: "submit" | "reset" | "button";
  size: "sm" | "md";
}
const ActionButton = ({ children, variant, className, type, size }: Props) => {
  return (
    <button
      type={type}
      className={`
    ${variant === "primary" && "bg-gray text-white"}
    ${size === "sm" && "p-2 text-xs"}
    rounded-md whitespace-nowrap
    ${className}
    `}
    >
      {children}
    </button>
  );
};

export default ActionButton;
