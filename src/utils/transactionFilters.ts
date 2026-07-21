import type { TransactionRecord } from '../types';

export type DateRangeFilter = 'Last 7 Days' | 'Last 30 Days' | 'Financial Year' | 'Custom';

export interface StatementSummaryMetrics {
  totalInflow: number;
  totalOutflow: number;
  netCashFlow: number;
}

// Historical generator for Financial Year view (Apr 1, 2026 to Jul 20, 2026)
const generateFinancialYearHistory = (accountKey: 'stable' | 'crunch'): TransactionRecord[] => {
  const historical: TransactionRecord[] = [];

  // June 2026
  historical.push(
    {
      id: 'tx-2026-06-30-1',
      date: '2026-06-30',
      dayNumber: '30',
      monthShort: 'JUN',
      payeeName: 'CORP INTEREST CREDIT Q1',
      referenceString: 'NEFT/N99283019283/INTEREST/ICICI',
      category: 'NEFT',
      amount: 14250.00,
      type: 'CREDIT',
      mode: 'NEFT',
      accountKey,
      timestamp: '30 Jun 2026, 05:00 PM',
      status: 'SUCCESS'
    },
    {
      id: 'tx-2026-06-25-1',
      date: '2026-06-25',
      dayNumber: '25',
      monthShort: 'JUN',
      payeeName: 'RELIANCE DIGITAL ELECTRONICS',
      referenceString: 'UPI/615299401928/RELIANCE/HDFC',
      category: 'UPI',
      amount: 32900.00,
      type: 'DEBIT',
      mode: 'UPI',
      accountKey,
      timestamp: '25 Jun 2026, 03:15 PM',
      status: 'SUCCESS'
    },
    {
      id: 'tx-2026-06-15-1',
      date: '2026-06-15',
      dayNumber: '15',
      monthShort: 'JUN',
      payeeName: 'QUANTUM MUTUAL FUND AUTO SIP',
      referenceString: 'BBPS/MF9928109283/QUANTUM/AUTO',
      category: 'BBPS',
      amount: 5000.00,
      type: 'DEBIT',
      mode: 'BBPS',
      accountKey,
      timestamp: '15 Jun 2026, 09:00 AM',
      status: 'SUCCESS'
    },
    {
      id: 'tx-2026-06-01-1',
      date: '2026-06-01',
      dayNumber: '01',
      monthShort: 'JUN',
      payeeName: 'QUANTUM CASH TECH SALARY CREDIT',
      referenceString: 'NEFT/N17293019283/SALARY/CORPORATE',
      category: 'Salary',
      amount: 150000.00,
      type: 'CREDIT',
      mode: 'NEFT',
      accountKey,
      timestamp: '01 Jun 2026, 12:00 AM',
      status: 'SUCCESS'
    }
  );

  // May 2026
  historical.push(
    {
      id: 'tx-2026-05-28-1',
      date: '2026-05-28',
      dayNumber: '28',
      monthShort: 'MAY',
      payeeName: 'HPCL AUTO FUEL STATION HYD',
      referenceString: 'UPI/614100928192/HPCL/PAYTM',
      category: 'UPI',
      amount: 4500.00,
      type: 'DEBIT',
      mode: 'UPI',
      accountKey,
      timestamp: '28 May 2026, 07:45 PM',
      status: 'SUCCESS'
    },
    {
      id: 'tx-2026-05-18-1',
      date: '2026-05-18',
      dayNumber: '18',
      monthShort: 'MAY',
      payeeName: 'STOCK DIVIDEND - TATA CONSULTANCY',
      referenceString: 'NEFT/N16293019283/DIVIDEND/NSDL',
      category: 'NEFT',
      amount: 18500.00,
      type: 'CREDIT',
      mode: 'NEFT',
      accountKey,
      timestamp: '18 May 2026, 11:30 AM',
      status: 'SUCCESS'
    },
    {
      id: 'tx-2026-05-01-1',
      date: '2026-05-01',
      dayNumber: '01',
      monthShort: 'MAY',
      payeeName: 'QUANTUM CASH TECH SALARY CREDIT',
      referenceString: 'NEFT/N15293019283/SALARY/CORPORATE',
      category: 'Salary',
      amount: 150000.00,
      type: 'CREDIT',
      mode: 'NEFT',
      accountKey,
      timestamp: '01 May 2026, 12:00 AM',
      status: 'SUCCESS'
    }
  );

  // April 2026
  historical.push(
    {
      id: 'tx-2026-04-20-1',
      date: '2026-04-20',
      dayNumber: '20',
      monthShort: 'APR',
      payeeName: 'INCOME TAX ADVANCE TAX REFUND',
      referenceString: 'NEFT/N14293019283/REFUND/ITD',
      category: 'NEFT',
      amount: 25400.00,
      type: 'CREDIT',
      mode: 'NEFT',
      accountKey,
      timestamp: '20 Apr 2026, 02:15 PM',
      status: 'SUCCESS'
    },
    {
      id: 'tx-2026-04-01-1',
      date: '2026-04-01',
      dayNumber: '01',
      monthShort: 'APR',
      payeeName: 'QUANTUM CASH TECH SALARY CREDIT',
      referenceString: 'NEFT/N13293019283/SALARY/CORPORATE',
      category: 'Salary',
      amount: 150000.00,
      type: 'CREDIT',
      mode: 'NEFT',
      accountKey,
      timestamp: '01 Apr 2026, 12:00 AM',
      status: 'SUCCESS'
    }
  );

  return historical;
};

export const filterTransactionsByDateRange = (
  baseRecords: TransactionRecord[],
  range: DateRangeFilter,
  accountKey: 'stable' | 'crunch'
): { filteredRecords: TransactionRecord[]; summaryMetrics: StatementSummaryMetrics } => {
  let allRecords = [...baseRecords];

  if (range === 'Financial Year') {
    const history = generateFinancialYearHistory(accountKey);
    // Combine baseRecords and history deduplicating by id
    const existingIds = new Set(baseRecords.map(r => r.id));
    history.forEach(h => {
      if (!existingIds.has(h.id)) {
        allRecords.push(h);
      }
    });
  }

  // Filter thresholds anchored to July 20, 2026
  const filteredRecords = allRecords.filter(rec => {
    if (!rec.date) return true;

    if (range === 'Last 7 Days') {
      // July 14, 2026 to July 20, 2026
      return rec.date >= '2026-07-14' && rec.date <= '2026-07-20';
    } else if (range === 'Last 30 Days') {
      // June 20, 2026 to July 20, 2026
      return rec.date >= '2026-06-20' && rec.date <= '2026-07-20';
    } else if (range === 'Financial Year') {
      // April 1, 2026 to July 20, 2026
      return rec.date >= '2026-04-01' && rec.date <= '2026-07-20';
    }

    return true;
  });

  // Calculate summary metrics
  let totalInflow = 0;
  let totalOutflow = 0;

  filteredRecords.forEach(r => {
    if (r.type === 'CREDIT') {
      totalInflow += r.amount;
    } else {
      totalOutflow += r.amount;
    }
  });

  const netCashFlow = totalInflow - totalOutflow;

  return {
    filteredRecords,
    summaryMetrics: {
      totalInflow,
      totalOutflow,
      netCashFlow
    }
  };
};
