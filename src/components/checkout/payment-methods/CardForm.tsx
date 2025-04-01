
import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCheckoutCustomization } from '@/contexts/CheckoutCustomizationContext';
import { CardSchema } from '@/components/checkout/utils/cardValidation';
import CardNameField from './form-fields/CardNameField';
import CardNumberField from './form-fields/CardNumberField';
import CardExpiryFields from './form-fields/CardExpiryFields';
import CVVField from './form-fields/CVVField';
import CardSubmitButton from './buttons/CardSubmitButton';

export interface CardFormData {
  cardName: string;
  cardNumber: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
}

export interface CardFormProps {
  onSubmit: (data: CardFormData) => Promise<any> | any;
  isSubmitting?: boolean;
  buttonText?: string;
  loading?: boolean;
}

const CardForm: React.FC<CardFormProps> = ({ 
  onSubmit, 
  loading = false, 
  isSubmitting = false,
  buttonText = "Pagar com Cartão"
}) => {
  const { customization } = useCheckoutCustomization();
  
  const methods = useForm<CardFormData>({
    defaultValues: {
      cardName: '',
      cardNumber: '',
      expiryMonth: '',
      expiryYear: '',
      cvv: ''
    },
    resolver: zodResolver(CardSchema),
    mode: 'onBlur'
  });

  const { handleSubmit, formState: { errors, isValid } } = methods;

  const enhancedSubmit = async (data: CardFormData) => {
    console.log("Card form submitted with data:", {
      cardName: data.cardName,
      cardNumber: data.cardNumber ? `****${data.cardNumber.slice(-4)}` : '',
      expiryMonth: data.expiryMonth,
      expiryYear: data.expiryYear,
      cvv: '***',
      isFormValid: isValid
    });
    
    try {
      await onSubmit(data);
    } catch (error) {
      console.error("Error in enhancedSubmit:", error);
    }
  };

  const buttonStyle = {
    backgroundColor: customization?.button_color || '#4caf50',
    color: customization?.button_text_color || '#ffffff'
  };

  const displayButtonText = customization?.button_text || buttonText;

  console.log("CardForm rendering with state:", { 
    loading, isSubmitting, 
    hasErrors: Object.keys(errors).length > 0,
    isValid 
  });

  return (
    <FormProvider {...methods}>
      <form 
        onSubmit={handleSubmit(enhancedSubmit)}
        className="space-y-4"
      >
        <CardNameField 
          disabled={loading || isSubmitting}
          error={errors.cardName?.message}
        />

        <CardNumberField 
          disabled={loading || isSubmitting}
          error={errors.cardNumber?.message}
        />

        <div className="grid grid-cols-3 gap-4">
          <CardExpiryFields 
            disabled={loading || isSubmitting}
            monthError={errors.expiryMonth?.message}
            yearError={errors.expiryYear?.message}
          />
          
          <CVVField 
            disabled={loading || isSubmitting}
            error={errors.cvv?.message}
          />
        </div>

        <CardSubmitButton 
          isLoading={loading}
          isSubmitting={isSubmitting}
          buttonText={displayButtonText}
          buttonStyle={buttonStyle}
        />
      </form>
    </FormProvider>
  );
};

export default CardForm;
