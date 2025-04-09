
import React from 'react';
import { RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { LucideIcon } from 'lucide-react';

interface RadioOptionProps {
  Icon: LucideIcon;
  label: string;
  description: string;
  onClick: () => void;
  selected: boolean;
  disabled?: boolean;
  loading?: boolean;
  // Add these props to match usage in PaymentOptions.tsx
  id?: string;
  value?: string;
  iconColor?: string;
}

const RadioOption: React.FC<RadioOptionProps> = ({ 
  Icon, 
  label, 
  description, 
  onClick, 
  selected, 
  disabled = false,
  loading = false,
  id,
  value,
  iconColor
}) => {
  return (
    <div 
      className={`flex items-center space-x-3 border p-4 rounded-md cursor-pointer transition-colors ${
        selected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'
      } ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}
      onClick={!disabled ? onClick : undefined}
    >
      <div className="flex-shrink-0">
        <Icon className={`h-6 w-6 ${selected ? 'text-blue-500' : iconColor || 'text-gray-500'}`} />
      </div>
      <div className="flex-1">
        <p className="font-medium">{label}</p>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
      {loading && (
        <div className="h-5 w-5 border-2 border-t-transparent border-blue-500 rounded-full animate-spin ml-2"></div>
      )}
    </div>
  );
};

export default RadioOption;
