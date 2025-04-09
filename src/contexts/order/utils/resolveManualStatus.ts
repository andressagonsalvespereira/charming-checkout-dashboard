
import { PaymentStatus } from '@/types/order';
import { getPaymentSettings } from '@/services/paymentSettingsService';

export const resolveManualCardStatus = async (): Promise<PaymentStatus> => {
  try {
    const settings = await getPaymentSettings();
    return settings.manualCardStatus;
  } catch (error) {
    console.error('Error getting manual card status:', error);
    return 'ANALYSIS';
  }
};
