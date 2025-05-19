import { useEffect, useState } from "react";
import img1 from "/images/promotion-1.jpeg";
import img4 from "/images/promotion-4.jpg";

const images = [img4, img1];

const PromotionSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-5">
      {/* title */}
      <div className="flex items-center justify-between text-secondary mb-2">
        <p className="font-bold">Promotion</p>
        {/* <p className="text-sm">See All</p> */}
      </div>
      <div className="flex flex-col gap-2">
        <div className="w-full h-[10rem] overflow-hidden rounded-lg">
          <div
            className="flex w-full h-full transition-transform duration-700 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {images.map((src, index) => (
              <img
                key={index}
                src={src}
                className="w-full h-full min-w-full object-cover object-center"
                alt={`Slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
        <div className="flex items-center justify-center gap-2">
          {images.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full cursor-pointer ${
                currentIndex === index ? "bg-secondary" : "bg-gray-300"
              }`}
              onClick={() => setCurrentIndex(index)}
            ></button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PromotionSlider;
