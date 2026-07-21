import type { TransactionRecord, Transaction } from '../types';

export const getFormattedStatementData = (
  appTransactions: Transaction[],
  accountKey: 'stable' | 'crunch'
): TransactionRecord[] => {
  // Base mock entries ending at July 20, 2026
  const baseMockRecords: TransactionRecord[] = [
    {
      id: 'tx-2026-07-20-1',
      date: '2026-07-20',
      dayNumber: '20',
      monthShort: 'JUL',
      payeeName: 'SWIGGY FOOD ORDER HYD',
      referenceString: 'UPI/620199482101/SWIGGY/ICICI B',
      category: 'UPI',
      amount: 485.00,
      type: 'DEBIT',
      mode: 'UPI',
      accountKey: 'stable',
      timestamp: '20 Jul 2026, 01:22 PM',
      status: 'SUCCESS'
    },
    {
      id: 'tx-2026-07-20-2',
      date: '2026-07-20',
      dayNumber: '20',
      monthShort: 'JUL',
      payeeName: 'VIVISH TECH SOLUTIONS PVT LTD',
      referenceString: 'Vivish Tech/mygate.paytm@okicici/UPI/HDFC B',
      category: 'UPI',
      amount: 4948.00,
      type: 'DEBIT',
      mode: 'UPI',
      accountKey: 'stable',
      timestamp: '20 Jul 2026, 11:05 AM',
      status: 'SUCCESS'
    },
    {
      id: 'tx-2026-07-18-1',
      date: '2026-07-18',
      dayNumber: '18',
      monthShort: 'JUL',
      payeeName: 'LALITHA SUBRAMANYAM',
      referenceString: 'MMT/IMPS/619859979711/IMPS PAN/LALITHA',
      category: 'IMPS',
      amount: 4000.00,
      type: 'CREDIT',
      mode: 'IMPS',
      accountKey: 'stable',
      timestamp: '18 Jul 2026, 04:45 PM',
      status: 'SUCCESS'
    },
    {
      id: 'tx-2026-07-15-1',
      date: '2026-07-15',
      dayNumber: '15',
      monthShort: 'JUL',
      payeeName: 'TSSPDCL ELECTRICITY BILL BBPS',
      referenceString: 'BBPS/TS109283019283/TSSPDCL/AUTO',
      category: 'BBPS',
      amount: 2840.00,
      type: 'DEBIT',
      mode: 'BBPS',
      accountKey: 'stable',
      timestamp: '15 Jul 2026, 09:10 AM',
      status: 'SUCCESS'
    },
    {
      id: 'tx-2026-07-12-1',
      date: '2026-07-12',
      dayNumber: '12',
      monthShort: 'JUL',
      payeeName: 'AMAZON PAY INDIA ONLINE RETAIL',
      referenceString: 'UPI/619200921822/AMAZON/AXIS B',
      category: 'UPI',
      amount: 1299.00,
      type: 'DEBIT',
      mode: 'UPI',
      accountKey: 'stable',
      timestamp: '12 Jul 2026, 06:18 PM',
      status: 'SUCCESS'
    },
    {
      id: 'tx-2026-07-08-1',
      date: '2026-07-08',
      dayNumber: '08',
      monthShort: 'JUL',
      payeeName: 'UBER INDIA RIDES HYD',
      referenceString: 'UPI/618299102911/UBER/PAYTM',
      category: 'UPI',
      amount: 340.00,
      type: 'DEBIT',
      mode: 'UPI',
      accountKey: 'stable',
      timestamp: '08 Jul 2026, 08:30 AM',
      status: 'SUCCESS'
    },
    {
      id: 'tx-2026-07-01-1',
      date: '2026-07-01',
      dayNumber: '01',
      monthShort: 'JUL',
      payeeName: 'QUANTUM CASH TECH SALARY CREDIT',
      referenceString: 'NEFT/N18293019283/SALARY/CORPORATE',
      category: 'Salary',
      amount: 150000.00,
      type: 'CREDIT',
      mode: 'NEFT',
      accountKey: 'stable',
      timestamp: '01 Jul 2026, 12:00 AM',
      status: 'SUCCESS'
    }
  ];

  // Convert AppContext dynamic transactions into TransactionRecord format
  const dynamicRecords: TransactionRecord[] = appTransactions.map((t, idx) => {
    const rawDate = t.date || '2026-07-20';
    const parts = rawDate.split('-');
    const dayNum = parts[2] || '20';
    const mShort = 'JUL';

    return {
      id: t.transaction_id || `app-tx-${idx}`,
      date: rawDate,
      dayNumber: dayNum,
      monthShort: mShort,
      payeeName: t.description.toUpperCase(),
      referenceString: `UPI/${t.transaction_id || Math.floor(100000000000 + Math.random() * 900000000000)}/QUANTUM`,
      category: t.type === 'INFLOW' ? 'NEFT' : 'UPI',
      amount: Math.abs(t.amount),
      type: t.type === 'INFLOW' ? 'CREDIT' : 'DEBIT',
      mode: t.type === 'INFLOW' ? 'NEFT' : 'UPI',
      accountKey: accountKey,
      timestamp: `${dayNum} JUL 2026, 02:30 PM`,
      status: 'SUCCESS'
    };
  });

  // Combine dynamic AppContext txns with baseline mock records, deduplicating by ID
  const idMap = new Set<string>();
  const combined: TransactionRecord[] = [];

  [...dynamicRecords, ...baseMockRecords].forEach(rec => {
    if (!idMap.has(rec.id)) {
      idMap.add(rec.id);
      combined.push(rec);
    }
  });

  return combined;
};
