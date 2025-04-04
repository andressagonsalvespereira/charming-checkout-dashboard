
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
