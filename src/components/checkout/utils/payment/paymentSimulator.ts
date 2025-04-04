
/**
 * Simulates a payment processing delay
 * @param timeout Time in milliseconds to simulate the payment processing
 * @returns Promise that resolves after the delay
 */
export const simulatePayment = async (timeout: number = 1000): Promise<{paymentId: string}> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ paymentId: `sim_${Date.now()}` });
    }, timeout);
  });
};

/**
 * Simulates the processing of a card payment
 * @param successRate Success rate (between 0 and 1)
 * @returns Promise that resolves with payment details
 */
export const simulateCardPayment = async (successRate = 0.7) => {
  // Simulate network delay for processing
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Simulate a successful or failed payment based on success rate
  const isSuccessful = Math.random() < successRate;
  
  return { 
    paymentId: `card_${Date.now()}`,
    status: isSuccessful ? 'CONFIRMED' : 'DECLINED'
  };
};

/**
 * Simulates PIX QR code generation
 * @returns Promise that resolves with PIX payment details
 */
export const simulatePixQrCodeGeneration = async () => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Return simulated PIX QR code data
  return {
    qrCode: '00020126580014BR.GOV.BCB.PIX0136123e4567-e89b-12d3-a456-426655440000',
    qrCodeImage: 'https://chart.googleapis.com/chart?chs=300x300&cht=qr&chl=00020126580014BR.GOV.BCB.PIX0136123e4567-e89b-12d3-a456-426655440000',
    expirationDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    paymentId: `pix_${Date.now()}`
  };
};
