import { useRef, useState } from "react";

interface OTPInputProps {
  length?: number;
  onComplete: (otp: string) => void;
  onChange: (otp: string, currentKey: string) => void; // New callback
  className?: string;
}

const OTPInput = ({
  length = 6,
  onComplete,
  onChange,
  className,
}: OTPInputProps) => {
  const [otp, setOtp] = useState<string[]>(new Array(length).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return; // Allow only digits
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    onChange(newOtp.join(""), value); // Send current input value to parent

    // Move to next input if available
    if (value && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    // Call onComplete when OTP is fully filled
    if (newOtp.every((num) => num !== "")) {
      onComplete(newOtp.join(""));
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    onChange(otp.join(""), e.key); // Send keypress to parent
  };

  return (
    <div className={`flex justify-center gap-2 ${className}`}>
      {otp.map((digit, index) => (
        <input
          key={index}
          ref={(el) => (inputRefs.current[index] = el)}
          type="text"
          maxLength={1}
          value={digit}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          className="w-10 md:w-12 h-10 md:h-12 text-center border border-gray-600 rounded-lg text-xl outline-none focus:ring-2 focus:ring-secondary"
        />
      ))}
    </div>
  );
};

export default OTPInput;
