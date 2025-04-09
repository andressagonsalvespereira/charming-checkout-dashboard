
import React from 'react';

interface CheckoutProgressProps {
  steps: string[];
  currentStep: number;
}

const CheckoutProgress: React.FC<CheckoutProgressProps> = ({ steps, currentStep }) => {
  return (
    <div className="grid grid-cols-4 gap-2">
      {steps.map((step, index) => (
        <div 
          key={index}
          className={`text-center p-2 rounded-md ${
            index < currentStep ? 'bg-green-100 text-green-800' :
            index === currentStep ? 'bg-blue-100 text-blue-800' : 
            'bg-gray-100 text-gray-400'
          }`}
        >
          {step}
        </div>
      ))}
    </div>
  );
};

export default CheckoutProgress;
