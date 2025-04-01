interface Props {
  children: React.ReactNode;
  variant: "primary";
  className?: string;
  type: "submit" | "reset" | "button";
}

const Button = ({ children, variant, className, type }: Props) => {
  return (
    <button
      className={`w-full p-3 rounded-full transition-all ease-in-out duration-300 ${
        variant === "primary" &&
        "bg-gradient-to-r from-[#B0CCDF] to-[#DCB8B0] font-bold"
      } active:shadow-lg active:text-gray-600 ${className}A`}
      type={type}
    >
      {children}
    </button>
  );
};

export default Button;
