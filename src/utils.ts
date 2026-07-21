import type { Transaction, ForecastResult, ForecastDay, ForecastPattern } from './types';
import { roundCurrency, calculateEndBalance } from './utils/mathUtils';

// Class merger utility (similar to clsx + tailwind-merge)
export function cn(...classes: (string | undefined | null | boolean | Record<string, boolean>)[]): string {
  const result: string[] = [];
  classes.forEach(c => {
    if (!c) return;
    if (typeof c === 'string') {
      result.push(c);
    } else if (typeof c === 'object') {
      Object.keys(c).forEach(key => {
        if (c[key]) {
          result.push(key);
        }
      });
    }
  });
  return result.join(' ');
}

// Indian Rupee currency formatter with masking
export function formatCurrency(amount: number, eyeHidden: boolean): string {
  if (eyeHidden) {
    return '₹••••••';
  }
  
  // Format as Indian Rupee (₹) standard formatting: ₹XX,XX,XXX.XX
  const isNegative = amount < 0;
  const absAmount = Math.abs(amount);
  
  const formatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  
  let formatted = formatter.format(absAmount);
  // Strip currency symbol if Intl adds it, so we can control spacing/sign
  formatted = formatted.replace('INR', '').replace('₹', '').trim();
  
  return `${isNegative ? '-' : ''}₹${formatted}`;
}

// Ported forecast engine logic from legacy server.js
export function calculateForecast(
  transactions: Transaction[], 
  scenario: 'stable' | 'crunch',
  startingBalance: number
): ForecastResult {
  // Filter sales and overhead to calculate averages
  const salesTxns = transactions.filter(t => t.category === 'Sales');
  const overheadTxns = transactions.filter(t => t.category === 'Overhead');
  
  // Calculate average daily values, matching legacy numbers if no data
  const avgSales = salesTxns.length > 0 
    ? salesTxns.reduce((sum, t) => sum + Math.abs(t.amount), 0) / salesTxns.length 
    : (scenario === 'crunch' ? 239.65 : 524.42);
    
  const avgOverhead = overheadTxns.length > 0 
    ? overheadTxns.reduce((sum, t) => sum + Math.abs(t.amount), 0) / overheadTxns.length 
    : (scenario === 'crunch' ? 88.11 : 90.81);

  // In the front-end, let's represent everything in Rupee values for presentation,
  // but do calculations in dollars then scale to Rupees by 83 to ensure 100% math consistency
  // as per instructions: "Indian Rupee (₹) Presentation: ledger data in dollars will be converted
  // to Rupees by a standard multiplier of 83."
  const scale = 83;
  
  const currentBalanceINR = startingBalance;
  
  const patterns: ForecastPattern[] = [
    { 
      name: '[Daily] Sales', 
      desc: `Avg Inflow: ${formatCurrency(avgSales * scale, false)}/day` 
    },
    { 
      name: '[Daily] Overhead', 
      desc: `Avg Outflow: ${formatCurrency(avgOverhead * scale, false)}/day` 
    },
    { 
      name: '[Weekly] Suppliers', 
      desc: scenario === 'crunch' 
        ? `Avg Outflow: ${formatCurrency(1200 * scale, false)} (Every 7 days)` 
        : `Avg Outflow: ${formatCurrency(800 * scale, false)} (Every 7 days)` 
    },
    { 
      name: '[Weekly] Utilities', 
      desc: `Avg Outflow: ${formatCurrency(150 * scale, false)} (Every 7 days)` 
    },
    { 
      name: '[Bi-weekly] Payroll', 
      desc: `Avg Outflow: ${formatCurrency(2500 * scale, false)} (Every 14 days)` 
    }
  ];
  
  const projection: ForecastDay[] = [];
  const dates = [
    { day: 'T+1', date: '2026-07-15' },
    { day: 'T+2', date: '2026-07-16' },
    { day: 'T+3', date: '2026-07-17' },
    { day: 'T+4', date: '2026-07-18' },
    { day: 'T+5', date: '2026-07-19' },
    { day: 'T+6', date: '2026-07-20' },
    { day: 'T+7', date: '2026-07-21' }
  ];
  
  let runningBalINR = roundCurrency(startingBalance);
  let hasCrunch = false;
  let crunchDate = '';
  let maxShortfallINR = 0;
  
  dates.forEach(d => {
    const startBal = runningBalINR;
    const inflow = roundCurrency(avgSales * scale);
    let expOutUSD = avgOverhead;
    const eventsList: string[] = [];
    
    // SaaS/Utilities on Wednesday (T+1, July 15)
    if (d.date === '2026-07-15') {
      expOutUSD += 150.00;
      eventsList.push('Utilities');
    }
    
    // Payroll on Friday (T+3, July 17)
    if (d.date === '2026-07-17') {
      expOutUSD += 2500.00;
      eventsList.push('Payroll');
    }
    
    // Suppliers on Monday (T+6, July 20)
    if (d.date === '2026-07-20') {
      const supplierAmt = scenario === 'crunch' ? 1200.00 : 800.00;
      expOutUSD += supplierAmt;
      eventsList.push('Suppliers');
    }
    
    const outflow = roundCurrency(expOutUSD * scale);
    const endBal = calculateEndBalance(startBal, inflow, outflow);
    runningBalINR = endBal;
    
    if (endBal < 0) {
      if (!hasCrunch) {
        hasCrunch = true;
        crunchDate = d.date;
      }
      const shortfall = roundCurrency(-endBal);
      if (shortfall > maxShortfallINR) {
        maxShortfallINR = shortfall;
      }
    }
    
    projection.push({
      day: d.day,
      date: d.date,
      start: startBal,
      in: inflow,
      out: outflow,
      end: endBal,
      events: eventsList.length > 0 ? eventsList.join(', ') : 'None'
    });
  });
  
  let warning = null;
  if (hasCrunch) {
    warning = {
      date: crunchDate,
      shortfall: maxShortfallINR
    };
  }

  // Dynamic generated letters
  const avgSalesINR = avgSales * scale;
  const avgOverheadINR = avgOverhead * scale;
  const endingBalanceINR = runningBalINR;
  
  const fallbackStableLetter = `[Pre-emptive Expansion & Strategic Scaling Request]

Dear Commercial Lending Team,

Subject: Request for Business Expansion Funding & Strategic Line of Credit - QuantumCash Enterprise

We are pleased to share that our company, QuantumCash Enterprise, is experiencing highly robust operational growth and exceptional financial stability. As our business continues to reach new heights, everything is going extremely well. To capitalize on this powerful momentum, accelerate our market expansion, and scale our high-margin operations, we are seeking to secure an additional business expansion loan or commercial line of credit.

We believe in full transparency and data-backed performance. Below are the verified financial proofs of our excellent cash flow health, directly compiled from our real-time predictive treasury engine:

1. Cash Flow Integrity & Proven Revenue Generation:
   - Average Daily Sales Revenue: ${formatCurrency(avgSalesINR, false)}
   - Average Daily Operational Overhead: ${formatCurrency(avgOverheadINR, false)}
   - Net Positive Daily Operating Surplus: +${formatCurrency(avgSalesINR - avgOverheadINR, false)} (Steady, consistent profitability)

2. Outstanding Liquidity Standing:
   - Current Account Reserve: ${formatCurrency(startingBalance, false)}
   - Projected End-of-Week Balance: ${formatCurrency(endingBalanceINR, false)} (Strong forward runway with absolutely zero liquidity gaps)
   - Cash Conversion Ratio: Highly efficient customer payment capture cycles with self-sustaining operational metrics.

3. Scaling Strategy & Use of Funds:
   With everything performing beautifully, this requested credit expansion will be deployed directly into high-ROI scaling channels:
   - Scaling current inventory capacity to meet surging client demand.
   - Expanding commercial marketing reach to capture adjacent regional markets.
   - Enhancing raw procurement buffers for additional volume discounts.

Our solid operating history, combined with these real-time mathematical cash proofs, demonstrates that QuantumCash Enterprise is a low-risk, high-performing partner. We are fully prepared to provide the complete transaction ledger and predictive treasury forecasts to expedite the underwriting process.

We look forward to partnering with your institution to power this next stage of our enterprise journey.

Sincerely,
Gandikota Lalitha Subramanyam
Chief Software Architect & Authorized Treasury Representative`;

  const fallbackCrunchLetter = `[Micro-Loan Request Letter - System Generated]

Dear Commercial Credit Committee,

Context & Financial Analysis:
Our company, QuantumCash Enterprise, is submitting this mathematically backed request for a short-term working capital micro-loan in the amount of ${formatCurrency(3000 * scale, false)}. Based on our predictive treasury engine's audit (as of July 14, 2026), our business is fundamentally healthy with daily customer sales of ${formatCurrency(avgSalesINR, false)} and daily administrative overhead of ${formatCurrency(avgOverheadINR, false)}.

Cause of the Cash Flow Gap:
Our forward cash flow projection highlights a critical, short-term timing mismatch on July 17, 2026, due to the concentration of two major scheduled obligations in close succession:
1. Bi-weekly employee payroll (${formatCurrency(2500 * scale, false)}) on July 17, 2026.
2. Weekly inventory restocking supplier payments (${formatCurrency(1200 * scale, false)}) on July 20, 2026.

Due to these concurrent draws, our balance is predicted to dip below zero on July 17, resulting in an estimated peak liquidity shortfall of ${formatCurrency(maxShortfallINR, false)}.

Loan Details & Repayment Strategy:
We request a micro-loan of ${formatCurrency(3000 * scale, false)} to bridge this temporary timing gap. This buffer will keep our operations liquid, protecting employee payroll and critical supply chains. Our steady daily customer sales revenue will fully cover the amortization and prompt repayment of the principal immediately as the weekly cycle resets.

Thank you for your timely review.

Sincerely,
Gandikota Lalitha Subramanyam
Authorized Treasury Representative`;

  const loanLetter = scenario === 'crunch' ? fallbackCrunchLetter : fallbackStableLetter;
  
  return {
    analysisDate: '2026-07-14',
    currentBalance: currentBalanceINR,
    patterns,
    projection,
    warning,
    loanLetter
  };
}
