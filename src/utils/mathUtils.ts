// Prevents IEEE 754 floating-point precision issues (e.g., 0.1 + 0.2 = 0.30000000000000004)
export const roundCurrency = (num: number): number => {
  return Math.round((num + Number.EPSILON) * 100) / 100;
};

// Calculates End Balance strictly maintaining startBal + inflow - outflow
export const calculateEndBalance = (startBal: number, inflow: number, outflow: number): number => {
  const roundedStart = roundCurrency(startBal);
  const roundedInflow = roundCurrency(inflow);
  const roundedOutflow = roundCurrency(outflow);
  
  return roundCurrency(roundedStart + roundedInflow - roundedOutflow);
};

// Standard Banking EMI Calculation formula: P * r * (1+r)^n / ((1+r)^n - 1)
export const calculateEMI = (principal: number, annualRatePercent: number, tenureMonths: number): number => {
  if (tenureMonths <= 0 || principal <= 0) return 0;
  const monthlyRate = annualRatePercent / (12 * 100);
  if (monthlyRate === 0) return roundCurrency(principal / tenureMonths);
  const factor = Math.pow(1 + monthlyRate, tenureMonths);
  const emi = (principal * monthlyRate * factor) / (factor - 1);
  return roundCurrency(emi);
};

// Formats numbers cleanly into Indian Rupee style (e.g., ₹56,97,464.45)
export const formatCurrency = (num: number, masked: boolean = false): string => {
  if (masked) return '₹••••••';
  const rounded = roundCurrency(num);
  const isNegative = rounded < 0;
  const absAmount = Math.abs(rounded);
  const formatted = absAmount.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
  return `${isNegative ? '-' : ''}₹${formatted}`;
};
