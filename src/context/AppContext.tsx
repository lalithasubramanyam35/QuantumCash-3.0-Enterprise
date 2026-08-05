import React, { createContext, useContext, useState, useEffect } from 'react';
import type { 
  User, 
  Transaction, 
  Bucket, 
  NavigationTab, 
  ForecastResult,
  ServiceRequest,
  Card,
  Nominee,
  SupportTicket,
  InsurancePolicy,
  InsuranceClaim,
  PreApprovedOffer,
  Loan,
  UpcomingPayment
} from '../types';
import { STABLE_LEDGER_DATA, CRUNCH_LEDGER_DATA } from '../ledger_data';
import { calculateForecast } from '../utils';

interface AppContextProps {
  user: User | null;
  loginUser: (name: string, email: string, phone: string) => void;
  logoutUser: () => void;
  currentTab: NavigationTab;
  setCurrentTab: (tab: NavigationTab) => void;
  eyeHidden: boolean;
  setEyeHidden: (hidden: boolean) => void;
  activeAccountKey: 'stable' | 'crunch';
  setActiveAccountKey: (key: 'stable' | 'crunch') => void;
  deepDiveAccountKey: 'stable' | 'crunch' | null;
  setDeepDiveAccountKey: (key: 'stable' | 'crunch' | null) => void;
  transactions: Transaction[];
  buckets: Bucket[];
  addTransaction: (type: 'INFLOW' | 'OUTFLOW', category: string, amount: number, description: string, targetAccountKey?: 'stable' | 'crunch') => { success: boolean; error?: string };
  createBucket: (name: string, type: 'saving' | 'spending', allocated: number, goal: string) => { success: boolean; error?: string };
  moveTransaction: (transactionId: string, newCategory: string) => { success: boolean; error?: string };
  getForecast: () => ForecastResult;
  getAccountBalances: () => { stable: number; crunch: number; total: number };
  resetData: () => void;

  // Service Request States & Actions
  serviceRequests: ServiceRequest[];
  cards: Card[];
  nominee: Nominee | null;
  supportTickets: SupportTicket[];
  updateAddress: (newAddress: string) => void;
  updateEmail: (newEmail: string) => void;
  updateCardLimits: (cardId: string, atmLimit: number, posLimit: number, ecomLimit: number, internationalEnabled: boolean) => void;
  updateCardPin: (cardId: string, pin: string) => void;
  updateNominee: (nominee: Nominee) => void;
  upgradeCard: (cardId: string, newTier: 'Silver' | 'Coral Platinum' | 'Sapphire World') => void;
  addServiceRequest: (category: string, status?: 'In Progress' | 'Action Required' | 'Completed') => string;
  blockCard: (cardId: string) => void;
  flagTransactionDispute: (transactionId: string) => void;
  raiseDisputeTicket: (ticket: Omit<SupportTicket, 'id' | 'dateRaised' | 'status'>) => string;
  stopChequePayment: (chequeNo: string, accountKey: string) => string;

  // Insurance States & Actions
  policies: InsurancePolicy[];
  claims: InsuranceClaim[];
  payPolicyPremium: (policyId: string, accountKey: 'stable' | 'crunch') => { success: boolean; error?: string };
  purchasePolicy: (newPolicy: Omit<InsurancePolicy, 'id' | 'policyNo' | 'status'>, accountKey: 'stable' | 'crunch') => string;
  initiateClaim: (claim: Omit<InsuranceClaim, 'claimId' | 'status' | 'dateFiled'>) => string;

  // Pre-approved Offers & Loans States & Actions
  offers: PreApprovedOffer[];
  offersUnlocked: boolean;
  loans: Loan[];
  unlockOffers: (pan: string, dob: string) => void;
  disbursePersonalLoan: (amount: number, tenureMonths: number, accountKey: 'stable' | 'crunch') => { refNo: string; emi: number };
  disburseCarLoan: (vehicleType: string, amount: number, tenureYears: number) => { refNo: string; emi: number };
  activateVirtualCreditCard: (cardName: string, limit: number) => string;
  disburseTwoWheelerLoan: (amount: number, tenureMonths: number) => { refNo: string; emi: number };

  // Upcoming Payments States & Actions
  upcomingPayments: UpcomingPayment[];
  payUpcomingPayment: (paymentId: string, accountKey: 'stable' | 'crunch') => { success: boolean; error?: string };
  toggleAutopay: (paymentId: string) => void;
  addUpcomingPayment: (newPayment: Omit<UpcomingPayment, 'id' | 'dueDaysLabel'>) => string;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

const SCALE = 83; // Dollar to Rupee multiplier

const DEFAULT_STABLE_BUCKETS: Bucket[] = [
  { id: 'suppliers', name: 'Suppliers', type: 'spending', allocated: 150000, goal: 'Inventory Stocking' },
  { id: 'utilities', name: 'Utilities', type: 'spending', allocated: 50000, goal: 'SaaS & Power Bills' },
  { id: 'rent', name: 'Rent', type: 'spending', allocated: 120000, goal: 'Office Rental' },
  { id: 'payroll', name: 'Payroll', type: 'spending', allocated: 350000, goal: 'Employee Salaries' },
  { id: 'expansion-fund', name: 'Expansion Fund', type: 'saving', allocated: 500000, goal: 'New Retail Branch' }
];

const DEFAULT_CRUNCH_BUCKETS: Bucket[] = [
  { id: 'suppliers', name: 'Suppliers', type: 'spending', allocated: 350000, goal: 'Critical Supply Chain' },
  { id: 'utilities', name: 'Utilities', type: 'spending', allocated: 40000, goal: 'SaaS Subscriptions' },
  { id: 'payroll', name: 'Payroll', type: 'spending', allocated: 300000, goal: 'Staff Wages' },
  { id: 'emergency-reserve', name: 'Emergency Reserve', type: 'saving', allocated: 200000, goal: 'Liquidity Runway Buffer' }
];

const DEFAULT_CARDS: Card[] = [
  {
    id: 'debit-card-1',
    name: 'Quantum Silver Debit Card',
    type: 'Debit',
    lastFour: '8390',
    atmLimit: 50000,
    posLimit: 100000,
    ecomLimit: 100000,
    internationalEnabled: false,
    tier: 'Silver'
  },
  {
    id: 'credit-card-1',
    name: 'Quantum Signature Card',
    type: 'Credit',
    lastFour: '7742',
    atmLimit: 40000,
    posLimit: 150000,
    ecomLimit: 150000,
    internationalEnabled: true,
    tier: 'Coral Platinum'
  },
  {
    id: 'credit-card-2',
    name: 'Quantum Corporate Credit Card',
    type: 'Credit',
    lastFour: '1109',
    atmLimit: 80000,
    posLimit: 200000,
    ecomLimit: 200000,
    internationalEnabled: true,
    tier: 'Sapphire World'
  }
];

const DEFAULT_SERVICE_REQUESTS: ServiceRequest[] = [
  {
    srn: 'SRN-98231',
    category: 'Address Change',
    dateRequested: '2026-07-10',
    status: 'Completed'
  },
  {
    srn: 'SRN-48211',
    category: 'Nominee Update',
    dateRequested: '2026-07-12',
    status: 'Completed'
  }
];

const INITIAL_POLICIES: InsurancePolicy[] = [
  {
    id: 'pol-life-1',
    policyNo: 'POL-LIFE-89201',
    title: 'Quantum Term Life Shield',
    category: 'Life',
    sumAssured: 10000000,
    premiumAmount: 12500,
    paymentFrequency: 'Annual',
    nextDueDate: '15 Aug 2026',
    nomineeName: 'Gandikota Subbarao',
    status: 'Active',
    taxExemptionType: '80C'
  },
  {
    id: 'pol-hlth-1',
    policyNo: 'POL-HLTH-44102',
    title: 'Quantum Health Care Shield',
    category: 'Health',
    sumAssured: 500000,
    premiumAmount: 8200,
    paymentFrequency: 'Annual',
    nextDueDate: '10 Oct 2026',
    nomineeName: 'Gandikota Subbarao',
    status: 'Active',
    taxExemptionType: '80D'
  }
];

const INITIAL_CLAIMS: InsuranceClaim[] = [
  {
    claimId: 'CLM-2026-88402',
    policyNo: 'POL-HLTH-44102',
    policyTitle: 'Quantum Health Care Shield',
    incidentDate: '2026-06-12',
    claimType: 'Cashless',
    amountClaimed: 45000,
    status: 'Approved',
    hospitalOrGarage: 'Apollo Hospital, Jubilee Hills',
    dateFiled: '2026-06-13'
  }
];

const INITIAL_OFFERS: PreApprovedOffer[] = [
  {
    id: 'off-pers-1',
    type: 'Personal Loan',
    title: 'Pre-approved Personal Loan',
    maxLimit: 500000,
    interestRate: '10.5% p.a.',
    badgeText: 'INSTANT DISBURSAL',
    isUnlocked: false,
    minAmount: 50000,
    maxTenureMonths: 60
  },
  {
    id: 'off-car-1',
    type: 'Car Loan',
    title: 'Pre-approved Car Loan',
    maxLimit: 1200000,
    interestRate: '8.75% p.a.',
    badgeText: 'DIGITAL SANCTION',
    isUnlocked: false,
    minAmount: 200000,
    maxTenureMonths: 84
  },
  {
    id: 'off-cc-1',
    type: 'Credit Card',
    title: 'Quantum Dual Credit Card',
    maxLimit: 250000,
    interestRate: 'Zero Annual Fee',
    badgeText: 'INSTANT VIRTUAL CARD',
    isUnlocked: false
  },
  {
    id: 'off-tw-1',
    type: 'Two-Wheeler Loan',
    title: 'Express Two-Wheeler Funding',
    maxLimit: 150000,
    interestRate: '9.5% p.a.',
    badgeText: '100% ON-ROAD FUNDING',
    isUnlocked: false,
    minAmount: 20000,
    maxTenureMonths: 36
  }
];

const INITIAL_LOANS: Loan[] = [
  {
    id: 'loan_1',
    name: 'Business Home Loan - Office HQ',
    outstanding: 1500000,
    monthlyEMI: 18500,
    interestRate: 8.75,
    tenureYearsRemaining: 15
  },
  {
    id: 'loan_2',
    name: 'Corporate Personal Loan - Liquidity Buffer',
    outstanding: 250000,
    monthlyEMI: 7800,
    interestRate: 11.5,
    tenureYearsRemaining: 3
  },
  {
    id: 'loan_3',
    name: 'Commercial Vehicle Loan - Logistics',
    outstanding: 350000,
    monthlyEMI: 9200,
    interestRate: 9.25,
    tenureYearsRemaining: 4
  }
];

const INITIAL_UPCOMING_PAYMENTS: UpcomingPayment[] = [
  {
    id: 'pay-cc-1',
    payeeName: 'Quantum Signature Credit Card Bill',
    category: 'Credit Card',
    amount: 14250,
    dueDate: '2026-07-23',
    dueDaysLabel: 'Due in 3 Days',
    isAutopayEnabled: false,
    frequency: 'Monthly'
  },
  {
    id: 'pay-util-1',
    payeeName: 'Electricity Bill (TSSPDCL Hyderabad)',
    category: 'Utility',
    amount: 2840,
    dueDate: '2026-07-25',
    dueDaysLabel: 'Due in 5 Days',
    isAutopayEnabled: true,
    frequency: 'Monthly'
  },
  {
    id: 'pay-emi-1',
    payeeName: 'Corporate Personal Loan EMI',
    category: 'Loan EMI',
    amount: 7800,
    dueDate: '2026-08-01',
    dueDaysLabel: 'Due on 1st of next month',
    isAutopayEnabled: true,
    frequency: 'Monthly',
    linkedLoanId: 'loan_2'
  },
  {
    id: 'pay-sip-1',
    payeeName: 'Quantum Growth Mutual Fund Auto-SIP',
    category: 'Investment SIP',
    amount: 5000,
    dueDate: '2026-07-28',
    dueDaysLabel: 'Due in 8 Days',
    isAutopayEnabled: true,
    frequency: 'Monthly'
  }
];

const DEFAULT_NOMINEE: Nominee = {
  name: 'Gandikota Subbarao',
  relationship: 'Parent',
  dob: '1970-05-15',
  allocationPercentage: 100
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // User Authentication State
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('qc_user');
    if (saved) return JSON.parse(saved);
    return null;
  });

  // UI state
  const [currentTab, setCurrentTab] = useState<NavigationTab>('Overview');
  const [eyeHidden, setEyeHidden] = useState<boolean>(true);
  const [activeAccountKey, setActiveAccountKey] = useState<'stable' | 'crunch'>('stable');
  const [deepDiveAccountKey, setDeepDiveAccountKeyRaw] = useState<'stable' | 'crunch' | null>(null);

  const setDeepDiveAccountKey = (key: 'stable' | 'crunch' | null) => {
    setDeepDiveAccountKeyRaw(key);
    if (key) {
      setActiveAccountKey(key);
    }
  };

  // Transactions database state (values converted to Rupees at compile/init time)
  const [stableTxns, setStableTxns] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('qc_stable_txns');
    if (saved) return JSON.parse(saved);
    
    // Scale existing dollar records to Rupees
    return STABLE_LEDGER_DATA.map(t => ({
      ...t,
      amount: parseFloat((t.amount * SCALE).toFixed(2))
    }));
  });

  const [crunchTxns, setCrunchTxns] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('qc_crunch_txns');
    if (saved) return JSON.parse(saved);
    
    return CRUNCH_LEDGER_DATA.map(t => ({
      ...t,
      amount: parseFloat((t.amount * SCALE).toFixed(2))
    }));
  });

  // Custom Buckets
  const [stableBuckets, setStableBuckets] = useState<Bucket[]>(() => {
    const saved = localStorage.getItem('qc_stable_buckets');
    return saved ? JSON.parse(saved) : DEFAULT_STABLE_BUCKETS;
  });

  const [crunchBuckets, setCrunchBuckets] = useState<Bucket[]>(() => {
    const saved = localStorage.getItem('qc_crunch_buckets');
    return saved ? JSON.parse(saved) : DEFAULT_CRUNCH_BUCKETS;
  });

  // Service Request States
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>(() => {
    const saved = localStorage.getItem('qc_service_requests');
    return saved ? JSON.parse(saved) : DEFAULT_SERVICE_REQUESTS;
  });

  const [cards, setCards] = useState<Card[]>(() => {
    const saved = localStorage.getItem('qc_cards');
    return saved ? JSON.parse(saved) : DEFAULT_CARDS;
  });

  const [nominee, setNominee] = useState<Nominee | null>(() => {
    const saved = localStorage.getItem('qc_nominee');
    return saved ? JSON.parse(saved) : DEFAULT_NOMINEE;
  });

  // Sync state to local storage
  useEffect(() => {
    localStorage.setItem('qc_user', user ? JSON.stringify(user) : '');
  }, [user]);

  useEffect(() => {
    localStorage.setItem('qc_stable_txns', JSON.stringify(stableTxns));
  }, [stableTxns]);

  useEffect(() => {
    localStorage.setItem('qc_crunch_txns', JSON.stringify(crunchTxns));
  }, [crunchTxns]);

  useEffect(() => {
    localStorage.setItem('qc_stable_buckets', JSON.stringify(stableBuckets));
  }, [stableBuckets]);

  useEffect(() => {
    localStorage.setItem('qc_crunch_buckets', JSON.stringify(crunchBuckets));
  }, [crunchBuckets]);

  useEffect(() => {
    localStorage.setItem('qc_service_requests', JSON.stringify(serviceRequests));
  }, [serviceRequests]);

  useEffect(() => {
    localStorage.setItem('qc_cards', JSON.stringify(cards));
  }, [cards]);

  useEffect(() => {
    localStorage.setItem('qc_nominee', nominee ? JSON.stringify(nominee) : '');
  }, [nominee]);

  const loginUser = (name: string, email: string, phone: string) => {
    setUser({ 
      name, 
      email, 
      phone, 
      address: 'Flat 402, Quantum Towers, Hitech City, Hyderabad, 500081' 
    });
  };

  const logoutUser = () => {
    setUser(null);
    setDeepDiveAccountKey(null);
    setCurrentTab('Overview');
  };

  const resetData = () => {
    localStorage.removeItem('qc_insurance_policies');
    localStorage.removeItem('qc_insurance_claims');
    localStorage.removeItem('qc_offers_unlocked');
    localStorage.removeItem('qc_user_loans');
    localStorage.removeItem('qc_upcoming_payments');
    localStorage.removeItem('qc_support_tickets');
    localStorage.removeItem('qc_service_requests');
    localStorage.removeItem('qc_cards');

    setStableTxns(STABLE_LEDGER_DATA.map(t => ({
      ...t,
      amount: parseFloat((t.amount * SCALE).toFixed(2))
    })));
    setCrunchTxns(CRUNCH_LEDGER_DATA.map(t => ({
      ...t,
      amount: parseFloat((t.amount * SCALE).toFixed(2))
    })));
    setStableBuckets(DEFAULT_STABLE_BUCKETS);
    setCrunchBuckets(DEFAULT_CRUNCH_BUCKETS);
    setServiceRequests(DEFAULT_SERVICE_REQUESTS);
    setCards(DEFAULT_CARDS);
    setNominee(DEFAULT_NOMINEE);
    setSupportTickets([]);
    setPolicies(INITIAL_POLICIES);
    setClaims(INITIAL_CLAIMS);
    setOffersUnlocked(false);
    setOffers(INITIAL_OFFERS.map(o => ({ ...o, isUnlocked: false })));
    setLoans(INITIAL_LOANS);
    setUpcomingPayments(INITIAL_UPCOMING_PAYMENTS);
    setDeepDiveAccountKey(null);
    setCurrentTab('Overview');
  };

  // Service Request Handlers
  const addServiceRequest = (
    category: string,
    status: 'In Progress' | 'Action Required' | 'Completed' = 'In Progress'
  ): string => {
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    const srn = `SRN-${randomNum}`;
    const newReq: ServiceRequest = {
      srn,
      category,
      dateRequested: new Date().toISOString().split('T')[0],
      status
    };
    setServiceRequests(prev => [newReq, ...prev]);
    return srn;
  };

  const updateAddress = (newAddress: string) => {
    if (user) {
      setUser({ ...user, address: newAddress });
      addServiceRequest('Address Change', 'Completed');
    }
  };

  const updateEmail = (newEmail: string) => {
    if (user) {
      setUser({ ...user, email: newEmail });
      addServiceRequest('Email ID Update', 'Completed');
    }
  };

  const updateCardLimits = (
    cardId: string,
    atmLimit: number,
    posLimit: number,
    ecomLimit: number,
    internationalEnabled: boolean
  ) => {
    setCards(prev =>
      prev.map(c =>
        c.id === cardId
          ? { ...c, atmLimit, posLimit, ecomLimit, internationalEnabled }
          : c
      )
    );
    addServiceRequest('Card Limit Update', 'Completed');
  };

  const updateCardPin = (_cardId: string, _pin: string) => {
    addServiceRequest('Card PIN Generation', 'Completed');
  };

  const updateNominee = (newNominee: Nominee) => {
    setNominee(newNominee);
    addServiceRequest('Nominee Update', 'Completed');
  };

  const upgradeCard = (cardId: string, newTier: 'Silver' | 'Coral Platinum' | 'Sapphire World') => {
    const tierNames = {
      'Silver': 'Quantum Silver Debit Card',
      'Coral Platinum': 'Quantum Coral Platinum Debit Card',
      'Sapphire World': 'Quantum Sapphire World Debit Card'
    };
    const fees = {
      'Silver': 0,
      'Coral Platinum': 500,
      'Sapphire World': 1999
    };
    const fee = fees[newTier];
    if (fee > 0) {
      addTransaction('OUTFLOW', 'Service', fee, `Debit Card Upgrade Fee (${newTier})`);
    }
    setCards(prev =>
      prev.map(c =>
        c.id === cardId
          ? { ...c, tier: newTier, name: tierNames[newTier] }
          : c
      )
    );
    addServiceRequest('Debit Card Upgrade', 'Completed');
  };

  const [supportTickets, setSupportTickets] = useState<SupportTicket[]>(() => {
    const saved = localStorage.getItem('qc_support_tickets');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('qc_support_tickets', JSON.stringify(supportTickets));
  }, [supportTickets]);

  const blockCard = (cardId: string) => {
    setCards(prev =>
      prev.map(c => (c.id === cardId ? { ...c, isBlocked: true } : c))
    );
    addServiceRequest('Emergency Card Block', 'Completed');
  };

  const flagTransactionDispute = (transactionId: string) => {
    const updateTxns = (txns: Transaction[]) =>
      txns.map(t => (t.transaction_id === transactionId ? { ...t, status: 'Under Review' as const } : t));
    setStableTxns(updateTxns);
    setCrunchTxns(updateTxns);
  };

  const raiseDisputeTicket = (ticket: Omit<SupportTicket, 'id' | 'dateRaised' | 'status'>) => {
    const randomId = `TKT-2026-${Math.floor(10000 + Math.random() * 90000)}`;
    const newTicket: SupportTicket = {
      ...ticket,
      id: randomId,
      dateRaised: new Date().toISOString().split('T')[0],
      status: 'Open'
    };
    setSupportTickets(prev => [newTicket, ...prev]);
    if (ticket.transactionId) {
      flagTransactionDispute(ticket.transactionId);
    }
    addServiceRequest(`Dispute: ${ticket.queryType} (${randomId})`, 'In Progress');
    return randomId;
  };

  const stopChequePayment = (chequeNo: string, _accountKey: string) => {
    const refNo = `STP-CHQ-${Math.floor(100000 + Math.random() * 900000)}`;
    addServiceRequest(`Stop Cheque (${chequeNo})`, 'Completed');
    return refNo;
  };

  // Insurance States
  const [policies, setPolicies] = useState<InsurancePolicy[]>(() => {
    const saved = localStorage.getItem('qc_insurance_policies');
    return saved ? JSON.parse(saved) : [
      {
        id: 'pol-life-1',
        policyNo: 'POL-LIFE-89201',
        title: 'Quantum Term Life Shield',
        category: 'Life',
        sumAssured: 10000000,
        premiumAmount: 12500,
        paymentFrequency: 'Annual',
        nextDueDate: '15 Aug 2026',
        nomineeName: 'Gandikota Subbarao',
        status: 'Active',
        taxExemptionType: '80C'
      },
      {
        id: 'pol-hlth-1',
        policyNo: 'POL-HLTH-44102',
        title: 'Quantum Health Care Shield',
        category: 'Health',
        sumAssured: 500000,
        premiumAmount: 8200,
        paymentFrequency: 'Annual',
        nextDueDate: '10 Oct 2026',
        nomineeName: 'Gandikota Subbarao',
        status: 'Active',
        taxExemptionType: '80D'
      }
    ];
  });

  const [claims, setClaims] = useState<InsuranceClaim[]>(() => {
    const saved = localStorage.getItem('qc_insurance_claims');
    return saved ? JSON.parse(saved) : [
      {
        claimId: 'CLM-2026-88402',
        policyNo: 'POL-HLTH-44102',
        policyTitle: 'Quantum Health Care Shield',
        incidentDate: '2026-06-12',
        claimType: 'Cashless',
        amountClaimed: 45000,
        status: 'Approved',
        hospitalOrGarage: 'Apollo Hospital, Jubilee Hills',
        dateFiled: '2026-06-13'
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem('qc_insurance_policies', JSON.stringify(policies));
  }, [policies]);

  useEffect(() => {
    localStorage.setItem('qc_insurance_claims', JSON.stringify(claims));
  }, [claims]);

  const payPolicyPremium = (policyId: string, _accountKey: 'stable' | 'crunch') => {
    const pol = policies.find(p => p.id === policyId);
    if (!pol) return { success: false, error: 'Policy not found' };
    const res = addTransaction('OUTFLOW', 'Insurance', pol.premiumAmount, `Premium Payment: ${pol.title} (${pol.policyNo})`);
    if (res.success) {
      addServiceRequest(`Insurance Premium Paid: ${pol.policyNo}`, 'Completed');
    }
    return res;
  };

  const purchasePolicy = (newPolicy: Omit<InsurancePolicy, 'id' | 'policyNo' | 'status'>, _accountKey: 'stable' | 'crunch') => {
    const polNo = `POL-${newPolicy.category.toUpperCase()}-${Math.floor(10000 + Math.random() * 90000)}`;
    const createdPolicy: InsurancePolicy = {
      ...newPolicy,
      id: `pol-${Date.now()}`,
      policyNo: polNo,
      status: 'Active'
    };
    addTransaction('OUTFLOW', 'Insurance', newPolicy.premiumAmount, `Policy Purchase: ${newPolicy.title} (${polNo})`);
    setPolicies(prev => [createdPolicy, ...prev]);
    addServiceRequest(`Insurance Purchase: ${polNo}`, 'Completed');
    return polNo;
  };

  const initiateClaim = (claimData: Omit<InsuranceClaim, 'claimId' | 'status' | 'dateFiled'>) => {
    const claimId = `CLM-2026-${Math.floor(10000 + Math.random() * 90000)}`;
    const newClaim: InsuranceClaim = {
      ...claimData,
      claimId,
      status: 'Submitted',
      dateFiled: new Date().toISOString().split('T')[0]
    };
    setClaims(prev => [newClaim, ...prev]);
    addServiceRequest(`Insurance Claim (${claimId})`, 'In Progress');
    return claimId;
  };

  // Pre-Approved Offers & Loans States
  const [offersUnlocked, setOffersUnlocked] = useState<boolean>(() => {
    return localStorage.getItem('qc_offers_unlocked') === 'true';
  });

  const [offers, setOffers] = useState<PreApprovedOffer[]>(() => {
    const isU = localStorage.getItem('qc_offers_unlocked') === 'true';
    return [
      {
        id: 'off-pers-1',
        type: 'Personal Loan',
        title: 'Pre-approved Personal Loan',
        maxLimit: 500000,
        interestRate: '10.5% p.a.',
        badgeText: 'INSTANT DISBURSAL',
        isUnlocked: isU,
        minAmount: 50000,
        maxTenureMonths: 60
      },
      {
        id: 'off-car-1',
        type: 'Car Loan',
        title: 'Pre-approved Car Loan',
        maxLimit: 1200000,
        interestRate: '8.75% p.a.',
        badgeText: 'DIGITAL SANCTION',
        isUnlocked: isU,
        minAmount: 200000,
        maxTenureMonths: 84
      },
      {
        id: 'off-cc-1',
        type: 'Credit Card',
        title: 'Quantum Dual Credit Card',
        maxLimit: 250000,
        interestRate: 'Zero Annual Fee',
        badgeText: 'INSTANT VIRTUAL CARD',
        isUnlocked: isU
      },
      {
        id: 'off-tw-1',
        type: 'Two-Wheeler Loan',
        title: 'Express Two-Wheeler Funding',
        maxLimit: 150000,
        interestRate: '9.5% p.a.',
        badgeText: '100% ON-ROAD FUNDING',
        isUnlocked: isU,
        minAmount: 20000,
        maxTenureMonths: 36
      }
    ];
  });

  const [loans, setLoans] = useState<Loan[]>(() => {
    const saved = localStorage.getItem('qc_user_loans');
    return saved ? JSON.parse(saved) : [
      {
        id: 'loan_1',
        name: 'Business Home Loan - Office HQ',
        outstanding: 1500000,
        monthlyEMI: 18500,
        interestRate: 8.75,
        tenureYearsRemaining: 15
      },
      {
        id: 'loan_2',
        name: 'Corporate Personal Loan - Liquidity Buffer',
        outstanding: 250000,
        monthlyEMI: 7800,
        interestRate: 11.5,
        tenureYearsRemaining: 3
      },
      {
        id: 'loan_3',
        name: 'Commercial Vehicle Loan - Logistics',
        outstanding: 350000,
        monthlyEMI: 9200,
        interestRate: 9.25,
        tenureYearsRemaining: 4
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem('qc_offers_unlocked', String(offersUnlocked));
  }, [offersUnlocked]);

  useEffect(() => {
    localStorage.setItem('qc_user_loans', JSON.stringify(loans));
  }, [loans]);

  // Upcoming Payments State
  const [upcomingPayments, setUpcomingPayments] = useState<UpcomingPayment[]>(() => {
    const saved = localStorage.getItem('qc_upcoming_payments');
    return saved ? JSON.parse(saved) : [
      {
        id: 'pay-cc-1',
        payeeName: 'Quantum Signature Credit Card Bill',
        category: 'Credit Card',
        amount: 14250,
        dueDate: '2026-07-23',
        dueDaysLabel: 'Due in 3 Days',
        isAutopayEnabled: false,
        frequency: 'Monthly'
      },
      {
        id: 'pay-util-1',
        payeeName: 'Electricity Bill (TSSPDCL Hyderabad)',
        category: 'Utility',
        amount: 2840,
        dueDate: '2026-07-25',
        dueDaysLabel: 'Due in 5 Days',
        isAutopayEnabled: true,
        frequency: 'Monthly'
      },
      {
        id: 'pay-emi-1',
        payeeName: 'Corporate Personal Loan EMI',
        category: 'Loan EMI',
        amount: 7800,
        dueDate: '2026-08-01',
        dueDaysLabel: 'Due on 1st of next month',
        isAutopayEnabled: true,
        frequency: 'Monthly',
        linkedLoanId: 'loan_2'
      },
      {
        id: 'pay-sip-1',
        payeeName: 'Quantum Growth Mutual Fund Auto-SIP',
        category: 'Investment SIP',
        amount: 5000,
        dueDate: '2026-07-28',
        dueDaysLabel: 'Due in 8 Days',
        isAutopayEnabled: true,
        frequency: 'Monthly'
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem('qc_upcoming_payments', JSON.stringify(upcomingPayments));
  }, [upcomingPayments]);

  const payUpcomingPayment = (paymentId: string, _accountKey: 'stable' | 'crunch') => {
    const item = upcomingPayments.find(p => p.id === paymentId);
    if (!item) return { success: false, error: 'Payment item not found' };

    const res = addTransaction('OUTFLOW', item.category, item.amount, `Upcoming Payment Paid: ${item.payeeName}`);
    if (!res.success) return res;

    if (item.linkedLoanId) {
      setLoans(prev => prev.map(l => {
        if (l.id === item.linkedLoanId) {
          const updatedOutstanding = Math.max(0, l.outstanding - item.amount);
          return { ...l, outstanding: updatedOutstanding };
        }
        return l;
      }));
    }

    if (item.linkedPolicyId) {
      setPolicies(prev => prev.map(p => {
        if (p.id === item.linkedPolicyId) {
          return { ...p, nextDueDate: '15 Aug 2027' };
        }
        return p;
      }));
    }

    setUpcomingPayments(prev => prev.filter(p => p.id !== paymentId));
    addServiceRequest(`Payment Settled: ${item.payeeName} (₹${item.amount.toLocaleString('en-IN')})`, 'Completed');

    return { success: true };
  };

  const toggleAutopay = (paymentId: string) => {
    setUpcomingPayments(prev => prev.map(p => {
      if (p.id === paymentId) {
        const nextVal = !p.isAutopayEnabled;
        addServiceRequest(`Autopay ${nextVal ? 'Enabled' : 'Disabled'}: ${p.payeeName}`, 'Completed');
        return { ...p, isAutopayEnabled: nextVal };
      }
      return p;
    }));
  };

  const addUpcomingPayment = (newPayment: Omit<UpcomingPayment, 'id' | 'dueDaysLabel'>) => {
    const id = `pay-${Date.now()}`;
    const paymentItem: UpcomingPayment = {
      ...newPayment,
      id,
      dueDaysLabel: `Due on ${newPayment.dueDate}`
    };
    setUpcomingPayments(prev => [paymentItem, ...prev]);
    addServiceRequest(`Payment Reminder Added: ${newPayment.payeeName}`, 'Completed');
    return id;
  };

  const unlockOffers = (_pan: string, _dob: string) => {
    setOffersUnlocked(true);
    setOffers(prev => prev.map(o => ({ ...o, isUnlocked: true })));
    addServiceRequest('Instant Offers Unlocked', 'Completed');
  };

  const disbursePersonalLoan = (amount: number, tenureMonths: number, _accountKey: 'stable' | 'crunch') => {
    const refNo = `PL-DISB-${Math.floor(100000 + Math.random() * 900000)}`;
    const r = 10.5 / (12 * 100);
    const n = tenureMonths;
    const emi = Math.round((amount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1));

    addTransaction('INFLOW', 'Loan Disbursal', amount, `Instant Personal Loan Credit (${refNo})`);

    const newLoan: Loan = {
      id: `loan-${Date.now()}`,
      name: `Instant Personal Loan (${refNo})`,
      outstanding: amount,
      monthlyEMI: emi,
      interestRate: 10.5,
      tenureYearsRemaining: Math.ceil(tenureMonths / 12)
    };
    setLoans(prev => [newLoan, ...prev]);
    addServiceRequest(`Personal Loan Disbursed: ₹${amount.toLocaleString('en-IN')}`, 'Completed');

    const firstEmiItem: UpcomingPayment = {
      id: `pay-emi-${Date.now()}`,
      payeeName: `${newLoan.name} Monthly EMI`,
      category: 'Loan EMI',
      amount: emi,
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      dueDaysLabel: 'Due in 30 Days',
      isAutopayEnabled: true,
      frequency: 'Monthly',
      linkedLoanId: newLoan.id
    };
    setUpcomingPayments(prev => [firstEmiItem, ...prev]);

    return { refNo, emi };
  };

  const disburseCarLoan = (vehicleType: string, amount: number, tenureYears: number) => {
    const refNo = `CL-SNC-${Math.floor(100000 + Math.random() * 900000)}`;
    const r = 8.75 / (12 * 100);
    const n = tenureYears * 12;
    const emi = Math.round((amount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1));

    const newLoan: Loan = {
      id: `loan-${Date.now()}`,
      name: `Car Loan - ${vehicleType} (${refNo})`,
      outstanding: amount,
      monthlyEMI: emi,
      interestRate: 8.75,
      tenureYearsRemaining: tenureYears
    };
    setLoans(prev => [newLoan, ...prev]);
    addServiceRequest(`Car Loan Sanctioned: ₹${amount.toLocaleString('en-IN')}`, 'Completed');
    return { refNo, emi };
  };

  const activateVirtualCreditCard = (cardName: string, limit: number) => {
    const lastFour = Math.floor(1000 + Math.random() * 9000).toString();
    const newCard: Card = {
      id: `card-${Date.now()}`,
      name: cardName,
      type: 'Credit',
      lastFour,
      atmLimit: 50000,
      posLimit: limit,
      ecomLimit: limit,
      internationalEnabled: true,
      tier: 'Sapphire World'
    };
    setCards(prev => [...prev, newCard]);
    addServiceRequest(`Virtual Credit Card Activated (•••• ${lastFour})`, 'Completed');
    return lastFour;
  };

  const disburseTwoWheelerLoan = (amount: number, tenureMonths: number) => {
    const refNo = `TW-DISB-${Math.floor(100000 + Math.random() * 900000)}`;
    const r = 9.5 / (12 * 100);
    const n = tenureMonths;
    const emi = Math.round((amount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1));

    const newLoan: Loan = {
      id: `loan-${Date.now()}`,
      name: `Two-Wheeler Loan (${refNo})`,
      outstanding: amount,
      monthlyEMI: emi,
      interestRate: 9.5,
      tenureYearsRemaining: Math.ceil(tenureMonths / 12)
    };
    setLoans(prev => [newLoan, ...prev]);
    addServiceRequest(`Two-Wheeler Loan Disbursed: ₹${amount.toLocaleString('en-IN')}`, 'Completed');
    return { refNo, emi };
  };

  // Get current active transaction set
  const currentTransactions = activeAccountKey === 'stable' ? stableTxns : crunchTxns;

  // Calculate current balances
  const getAccountBalances = () => {
    const stableBal = stableTxns.reduce((sum, t) => {
      return t.type === 'OUTFLOW' ? sum - t.amount : sum + t.amount;
    }, 0);
    const crunchBal = crunchTxns.reduce((sum, t) => {
      return t.type === 'OUTFLOW' ? sum - t.amount : sum + t.amount;
    }, 0);
    return {
      stable: parseFloat(stableBal.toFixed(2)),
      crunch: parseFloat(crunchBal.toFixed(2)),
      total: parseFloat((stableBal + crunchBal).toFixed(2))
    };
  };

  // Enriched Buckets details (spent and saved totals calculated from transactions)
  const getEnrichedBuckets = (): Bucket[] => {
    const activeBuckets = activeAccountKey === 'stable' ? stableBuckets : crunchBuckets;
    const txns = currentTransactions;

    const DEFAULT_BUCKET_SEED: Record<string, { spent: number; saved: number }> = {
      'suppliers': { spent: 97500, saved: 0 },
      'utilities': { spent: 38000, saved: 0 },
      'rent': { spent: 120000, saved: 0 },
      'payroll': { spent: 210000, saved: 0 },
      'expansion fund': { spent: 0, saved: 325000 },
      'emergency reserve': { spent: 0, saved: 130000 }
    };

    // Map through active buckets and calculate spent & saved
    return activeBuckets.map(b => {
      const seed = DEFAULT_BUCKET_SEED[b.name.toLowerCase()] || { spent: 0, saved: 0 };
      let spent = seed.spent;
      let saved = seed.saved;
      
      txns.forEach(t => {
        if (t.category.toLowerCase() === b.name.toLowerCase()) {
          if (t.type === 'OUTFLOW') {
            spent += Math.abs(t.amount);
          } else if (t.type === 'INFLOW') {
            saved += Math.abs(t.amount);
          }
        }
      });

      if (b.type === 'saving') {
        const currentAmount = saved - spent;
        const percentage = b.allocated > 0 ? (currentAmount / b.allocated) * 100 : 0;
        return {
          ...b,
          spent,
          saved,
          currentAmount: Math.max(0, currentAmount),
          remaining: Math.max(0, b.allocated - currentAmount),
          percentage: Math.max(0, Math.min(100, parseFloat(percentage.toFixed(2)))),
          isAlert: false
        };
      } else {
        const totalFunds = b.allocated + saved;
        const percentage = totalFunds > 0 ? (spent / totalFunds) * 100 : 0;
        const isAlert = percentage >= 90;
        return {
          ...b,
          spent,
          saved,
          totalFunds, // custom property inside component
          remaining: Math.max(0, totalFunds - spent),
          percentage: parseFloat(percentage.toFixed(2)),
          isAlert
        };
      }
    }) as Bucket[];
  };

  const addTransaction = (
    type: 'INFLOW' | 'OUTFLOW',
    category: string,
    amount: number,
    description: string,
    targetAccountKey?: 'stable' | 'crunch'
  ): { success: boolean; error?: string } => {
    if (isNaN(amount) || amount <= 0) {
      return { success: false, error: 'Invalid amount' };
    }

    const targetKey = targetAccountKey || activeAccountKey;
    const balances = getAccountBalances();
    const currentBal = targetKey === 'stable' ? balances.stable : balances.crunch;

    // Check savings bucket limits for outflows
    const enrichedBuckets = getEnrichedBuckets();
    const targetBucket = enrichedBuckets.find(b => b.name.toLowerCase() === category.toLowerCase());
    
    if (type === 'OUTFLOW') {
      if (amount > currentBal) {
        return { success: false, error: 'Insufficient account balance for this withdrawal.' };
      }

      if (targetBucket && targetBucket.type === 'saving') {
        const currentAmt = targetBucket.currentAmount || 0;
        if (amount > currentAmt) {
          return { 
            success: false, 
            error: `Insufficient funds in Savings bucket '${category}'. Available: ₹${currentAmt.toLocaleString('en-IN', {minimumFractionDigits: 2})}` 
          };
        }
      }
    }

    const utr = `TXN_20260720_${Math.floor(100000 + Math.random() * 900000)}`;
    const newTxn: Transaction = {
      date: '2026-07-20',
      transaction_id: utr,
      type,
      amount: amount,
      category,
      description: description || 'User added transaction'
    };

    if (targetKey === 'stable') {
      setStableTxns(prev => [newTxn, ...prev]);
    } else {
      setCrunchTxns(prev => [newTxn, ...prev]);
    }

    return { success: true };
  };

  const createBucket = (
    name: string,
    type: 'saving' | 'spending',
    allocated: number,
    goal: string
  ): { success: boolean; error?: string } => {
    if (!name || isNaN(allocated) || allocated <= 0) {
      return { success: false, error: 'Invalid bucket details' };
    }

    const newBucket: Bucket = {
      id: name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      name,
      type,
      allocated,
      goal: goal || ''
    };

    if (activeAccountKey === 'stable') {
      if (stableBuckets.some(b => b.name.toLowerCase() === name.toLowerCase())) {
        return { success: false, error: 'A bucket with this name already exists' };
      }
      setStableBuckets(prev => [...prev, newBucket]);
    } else {
      if (crunchBuckets.some(b => b.name.toLowerCase() === name.toLowerCase())) {
        return { success: false, error: 'A bucket with this name already exists' };
      }
      setCrunchBuckets(prev => [...prev, newBucket]);
    }

    return { success: true };
  };

  const moveTransaction = (
    transactionId: string,
    newCategory: string
  ): { success: boolean; error?: string } => {
    let success = false;
    let errorMsg = '';

    const updateTxnList = (prev: Transaction[]): Transaction[] => {
      const index = prev.findIndex(t => t.transaction_id === transactionId);
      if (index === -1) return prev;

      const txn = prev[index];
      
      // Check savings bucket constraint if moving an expense OUT of a saving bucket
      // or check target saving bucket balance
      if (txn.type === 'OUTFLOW' && txn.category.toLowerCase() !== newCategory.toLowerCase()) {
        const enrichedBuckets = getEnrichedBuckets();
        const targetBucket = enrichedBuckets.find(b => b.name.toLowerCase() === newCategory.toLowerCase());
        
        if (targetBucket && targetBucket.type === 'saving') {
          const currentAmt = targetBucket.currentAmount || 0;
          if (Math.abs(txn.amount) > currentAmt) {
            errorMsg = `Insufficient funds in target savings bucket '${newCategory}' to absorb this expense.`;
            return prev;
          }
        }
      }

      success = true;
      const updated = [...prev];
      updated[index] = { ...txn, category: newCategory };
      return updated;
    };

    if (activeAccountKey === 'stable') {
      setStableTxns(prev => {
        const res = updateTxnList(prev);
        return res;
      });
    } else {
      setCrunchTxns(prev => {
        const res = updateTxnList(prev);
        return res;
      });
    }

    return success ? { success: true } : { success: false, error: errorMsg || 'Transaction not found' };
  };

  const getForecast = (): ForecastResult => {
    const activeBalance = activeAccountKey === 'stable' 
      ? getAccountBalances().stable 
      : getAccountBalances().crunch;

    // Convert transactions back to dollar metrics temporarily to reuse legacy simulation parameters
    const dollarTransactions = currentTransactions.map(t => ({
      ...t,
      amount: t.amount / SCALE
    }));

    return calculateForecast(dollarTransactions, activeAccountKey, activeBalance);
  };

  return (
    <AppContext.Provider
      value={{
        user,
        loginUser,
        logoutUser,
        currentTab,
        setCurrentTab,
        eyeHidden,
        setEyeHidden,
        activeAccountKey,
        setActiveAccountKey,
        deepDiveAccountKey,
        setDeepDiveAccountKey,
        transactions: currentTransactions,
        buckets: getEnrichedBuckets(),
        addTransaction,
        createBucket,
        moveTransaction,
        getForecast,
        getAccountBalances,
        resetData,
        // Service requests state mapping
        serviceRequests,
        cards,
        nominee,
        supportTickets,
        updateAddress,
        updateEmail,
        updateCardLimits,
        updateCardPin,
        updateNominee,
        upgradeCard,
        addServiceRequest,
        blockCard,
        flagTransactionDispute,
        raiseDisputeTicket,
        stopChequePayment,
        // Insurance mappings
        policies,
        claims,
        payPolicyPremium,
        purchasePolicy,
        initiateClaim,
        // Offers & Loans mappings
        offers,
        offersUnlocked,
        loans,
        unlockOffers,
        disbursePersonalLoan,
        disburseCarLoan,
        activateVirtualCreditCard,
        disburseTwoWheelerLoan,
        // Upcoming Payments mappings
        upcomingPayments,
        payUpcomingPayment,
        toggleAutopay,
        addUpcomingPayment
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
