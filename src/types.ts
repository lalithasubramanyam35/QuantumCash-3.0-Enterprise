export interface User {
  name: string;
  email: string;
  phone: string;
  address?: string;
}

export type TransactionType = 'INFLOW' | 'OUTFLOW';

export interface Transaction {
  date: string;
  transaction_id: string;
  type: TransactionType;
  amount: number;
  category: string;
  description: string;
  runningBalance?: number;
  status?: 'Completed' | 'Under Review' | 'Disputed';
}

export type BucketType = 'saving' | 'spending';

export interface Bucket {
  id: string;
  name: string;
  type: BucketType;
  allocated: number;
  goal: string;
  currentAmount?: number;
  spent?: number;
  saved?: number;
  remaining?: number;
  percentage?: number;
  isAlert?: boolean;
}

export interface Deposit {
  id: string;
  name: string;
  type: 'FD' | 'RD';
  principal: number;
  interestRate: number;
  maturityDate: string;
  maturityAmount: number;
  monthlyInstallment?: number;
}

export interface Investment {
  id: string;
  name: string;
  category: 'Equity' | 'SSY' | 'PPF' | 'Demat';
  amount: number;
  returnsPercent: number;
}

export interface Loan {
  id: string;
  name: string;
  outstanding: number;
  monthlyEMI: number;
  interestRate: number;
  tenureYearsRemaining: number;
}

export interface CreditCard {
  id: string;
  name: string;
  outstanding: number;
  dueDate: string;
  limit: number;
}

export interface ForecastDay {
  day: string;
  date: string;
  start: number;
  in: number;
  out: number;
  end: number;
  events: string;
}

export interface ForecastPattern {
  name: string;
  desc: string;
}

export interface ForecastWarning {
  date: string;
  shortfall: number;
}

export interface ForecastResult {
  analysisDate: string;
  currentBalance: number;
  patterns: ForecastPattern[];
  projection: ForecastDay[];
  warning: ForecastWarning | null;
  loanLetter: string;
}

export type NavigationTab =
  | 'Overview'
  | 'Accounts'
  | 'Payment & Transfer'
  | 'Deposits'
  | 'Cards'
  | 'Loans'
  | 'Investments'
  | 'Insurance'
  | 'Customer Service';

export interface ServiceRequest {
  srn: string;
  category: string;
  dateRequested: string;
  status: 'In Progress' | 'Action Required' | 'Completed';
}

export interface Card {
  id: string;
  name: string;
  type: 'Debit' | 'Credit';
  lastFour: string;
  atmLimit: number;
  posLimit: number;
  ecomLimit: number;
  internationalEnabled: boolean;
  tier: 'Silver' | 'Coral Platinum' | 'Sapphire World';
  isBlocked?: boolean;
}

export interface Nominee {
  name: string;
  relationship: 'Spouse' | 'Child' | 'Parent' | 'Sibling';
  dob: string;
  allocationPercentage: number;
  guardianName?: string;
  guardianAddress?: string;
}

export interface SupportTicket {
  id: string;
  queryType: string;
  accountKey: 'stable' | 'crunch';
  transactionId?: string;
  description: string;
  attachmentName?: string;
  dateRaised: string;
  status: 'Open' | 'Under Review' | 'Resolved';
}

export interface BranchDetails {
  id: string;
  name: string;
  type: 'Branch' | 'ATM' | 'Branch & ATM';
  address: string;
  pincode: string;
  city: string;
  ifsc?: string;
  workingHours?: string;
  phone?: string;
}

export interface InsurancePolicy {
  id: string;
  policyNo: string;
  title: string;
  category: 'Life' | 'Health' | 'Motor' | 'Travel' | 'Cyber';
  sumAssured: number;
  premiumAmount: number;
  paymentFrequency: 'Annual' | 'Monthly';
  nextDueDate: string;
  nomineeName?: string;
  status: 'Active' | 'Grace Period' | 'Expired';
  taxExemptionType?: '80C' | '80D';
}

export interface InsuranceClaim {
  claimId: string;
  policyNo: string;
  policyTitle: string;
  incidentDate: string;
  claimType: 'Cashless' | 'Reimbursement' | 'Accident/Loss';
  amountClaimed: number;
  status: 'Submitted' | 'Under Verification' | 'Approved' | 'Settled';
  hospitalOrGarage?: string;
  dateFiled: string;
}

export interface PreApprovedOffer {
  id: string;
  type: 'Personal Loan' | 'Car Loan' | 'Credit Card' | 'Two-Wheeler Loan';
  title: string;
  maxLimit: number;
  interestRate: string;
  badgeText: string;
  isUnlocked: boolean;
  minAmount?: number;
  maxTenureMonths?: number;
}

export type BillerCategory = 'Utility' | 'Credit Card' | 'Rent' | 'Insurance Premium' | 'Loan EMI' | 'Investment SIP' | 'Custom Transfer';

export interface UpcomingPayment {
  id: string;
  payeeName: string;
  category: BillerCategory;
  amount: number;
  dueDate: string;
  dueDaysLabel: string;
  isAutopayEnabled: boolean;
  frequency: 'One-time' | 'Monthly' | 'Quarterly';
  linkedPolicyId?: string;
  linkedLoanId?: string;
}

export interface TourStep {
  stepIndex: number;
  title: string;
  description: string;
  targetTab?: NavigationTab;
  position: 'top' | 'bottom' | 'left' | 'right' | 'center';
}

export interface TransactionRecord {
  id: string;
  date: string;
  dayNumber: string;
  monthShort: string;
  payeeName: string;
  referenceString: string;
  category: 'UPI' | 'IMPS' | 'NEFT' | 'BBPS' | 'Salary' | 'Transfer' | 'Card';
  amount: number;
  type: 'CREDIT' | 'DEBIT';
  runningBalance?: number;
  mode?: string;
  accountKey?: 'stable' | 'crunch';
  timestamp?: string;
  status?: 'SUCCESS' | 'PENDING' | 'FAILED';
}

export interface CardDetails {
  id: string;
  name: string;
  type: 'Credit' | 'Debit';
  cardNumber: string;
  cvv: string;
  expiry: string;
  creditLimit?: number;
  availableLimit?: number;
  linkedAccount: string;
  isOnlineEnabled: boolean;
  isAtmEnabled: boolean;
  isContactlessEnabled: boolean;
  isInternationalEnabled: boolean;
  dailyLimit: number;
}

export interface LoanAccount {
  id: string;
  accountNo: string;
  loanType: string;
  outstandingAmount: number;
  interestRate: number;
  monthlyEmi: number;
  nextDueDate: string;
  tenureMonthsRemaining: number;
}

export interface Payee {
  id: string;
  name: string;
  accountNo: string;
  ifsc: string;
  bankName: string;
  dailyLimit: number;
}
