import React from "react";

const CarouselSteps = ({ steps, currentStep }) => {
  return (
    <div className="fixed left-4 top-1/2 transform -translate-y-1/2 flex flex-col items-center space-y-4">
      {Array.from({ length: steps.length + 1 }, (_, index) => (
        <div
          key={index}
          className={`w-5 h-5 flex items-center justify-center rounded-full border border-white ${currentStep === index
              ? " text-white"
              : "bg-gray-300 text-gray-700"
            }`}
        >
        </div>
      ))}
    </div>
  );
};

export default CarouselSteps;
