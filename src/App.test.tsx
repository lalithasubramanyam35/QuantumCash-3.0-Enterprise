import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import React from 'react';
import { formatCurrency, calculateForecast } from './utils';
import { STABLE_LEDGER_DATA, CRUNCH_LEDGER_DATA } from './ledger_data';
import { AppProvider, useApp } from './context/AppContext';
import { ServiceRequestModalWrapper } from './components/ServiceRequests/ServiceRequestModalWrapper';
import { TrackServiceRequestsModal } from './components/ServiceRequests/TrackServiceRequestsModal';
import { AddressChangeModal } from './components/ServiceRequests/AddressChangeModal';
import { GenerateCardPinModal } from './components/ServiceRequests/GenerateCardPinModal';
import { ManageCardLimitsModal } from './components/ServiceRequests/ManageCardLimitsModal';
import { UpdateEmailModal } from './components/ServiceRequests/UpdateEmailModal';
import { NomineeManagementModal } from './components/ServiceRequests/NomineeManagementModal';
import { UpgradeCardModal } from './components/ServiceRequests/UpgradeCardModal';
import { PositivePayModal } from './components/ServiceRequests/PositivePayModal';
import { CustomerServiceView } from './components/CustomerServiceView';
import { RaiseDisputeModal } from './components/CustomerService/RaiseDisputeModal';
import { EmergencyQuickActions } from './components/CustomerService/EmergencyQuickActions';
import { Dashboard } from './components/Dashboard';
import { InsuranceView } from './components/InsuranceView';
import { InsuranceCalculator } from './components/Insurance/InsuranceCalculator';
import { BuyInsuranceModal } from './components/Insurance/BuyInsuranceModal';
import { InitiateClaimModal } from './components/Insurance/InitiateClaimModal';
import { UnlockOffersModal } from './components/Offers/UnlockOffersModal';
import { PersonalLoanOfferModal } from './components/Offers/PersonalLoanOfferModal';
import { CarLoanOfferModal } from './components/Offers/CarLoanOfferModal';
import { CreditCardOfferModal } from './components/Offers/CreditCardOfferModal';
import { UpcomingPaymentsPill } from './components/UpcomingPayments/UpcomingPaymentsPill';
import { UpcomingPaymentsDrawer } from './components/UpcomingPayments/UpcomingPaymentsDrawer';
import { AddReminderModal } from './components/UpcomingPayments/AddReminderModal';
import { DemoMenuDropdown } from './components/DemoSystem/DemoMenuDropdown';
import { ResetDemoModal } from './components/DemoSystem/ResetDemoModal';
import { GuidedTourModal } from './components/DemoSystem/GuidedTourModal';
import { OverviewQuickActions } from './components/OverviewQuickActions';
import { SendMoneyModal } from './components/QuickActions/SendMoneyModal';
import { PayBillsModal } from './components/QuickActions/PayBillsModal';
import { RecentTransactions } from './components/QuickActions/RecentTransactions';
import { TransactionStatementModal } from './components/Transactions/TransactionStatementModal';
import { OverviewPortfolioTabs } from './components/OverviewPortfolioTabs';
import { filterTransactionsByDateRange } from './utils/transactionFilters';
import { getFormattedStatementData } from './utils/transactionData';
import { PaymentTransferView } from './components/Views/PaymentTransferView';
import { CardsView } from './components/Views/CardsView';
import { LoansView } from './components/Views/LoansView';
import { OpenDepositModal } from './components/Deposits/OpenDepositModal';
import { AddInvestmentModal } from './components/Investments/AddInvestmentModal';
import { SystemArchitectureModal } from './components/Architecture/SystemArchitectureModal';
import { calculateEMI, roundCurrency } from './utils/mathUtils';

describe('QuantumCash 3.0 Core Analytical Engine Tests', () => {

  describe('Currency Masking and Formatting Logic', () => {
    it('should correctly format values in Indian Rupees (INR) when unmasked', () => {
      expect(formatCurrency(123456.78, false)).toBe('₹1,23,456.78');
      expect(formatCurrency(1000, false)).toBe('₹1,000.00');
      expect(formatCurrency(0, false)).toBe('₹0.00');
    });

    it('should prefix negative sign before currency symbol for negative figures', () => {
      expect(formatCurrency(-50000, false)).toBe('-₹50,000.00');
    });

    it('should return masked symbols when eyeHidden is true', () => {
      expect(formatCurrency(123456.78, true)).toBe('₹••••••');
      expect(formatCurrency(-50000, true)).toBe('₹••••••');
    });
  });

  describe('Ledger Balance Mathematical Consistency', () => {
    it('should compute exact starting balance offsets for Stable Scenario', () => {
      const initialTxn = STABLE_LEDGER_DATA.find(t => t.transaction_id === 'TXN_INIT');
      expect(initialTxn).toBeDefined();
      expect(initialTxn?.amount).toBe(6000.0);
    });

    it('should verify Crunch Scenario starting balance is consistent', () => {
      const initialTxn = CRUNCH_LEDGER_DATA.find(t => t.transaction_id === 'TXN_INIT');
      expect(initialTxn).toBeDefined();
      expect(initialTxn?.amount).toBe(9000.0);
    });

    it('should verify sum of all stable transactions matches expected final balance', () => {
      const finalBalanceUSD = STABLE_LEDGER_DATA.reduce((sum, t) => {
        if (t.type === 'OUTFLOW') return sum - Math.abs(t.amount);
        return sum + Math.abs(t.amount);
      }, 0);
      expect(parseFloat(finalBalanceUSD.toFixed(2))).toBe(8189.99);
    });

    it('should verify sum of all crunch transactions matches expected final balance', () => {
      const finalBalanceUSD = CRUNCH_LEDGER_DATA.reduce((sum, t) => {
        if (t.type === 'OUTFLOW') return sum - Math.abs(t.amount);
        return sum + Math.abs(t.amount);
      }, 0);
      expect(parseFloat(finalBalanceUSD.toFixed(2))).toBe(601.32);
    });
  });

  describe('Cash Flow Forecasting Logic', () => {
    it('should generate T+1 to T+7 daily cash flows', () => {
      const forecastResult = calculateForecast(STABLE_LEDGER_DATA, 'stable', 8189.99 * 83);
      expect(forecastResult.projection).toHaveLength(7);
      expect(forecastResult.projection[0].day).toBe('T+1');
      expect(forecastResult.projection[6].day).toBe('T+7');
    });

    it('should flag a cash crunch warning on Crunch Scenario due to payroll & supplier restock draws', () => {
      const forecastResult = calculateForecast(CRUNCH_LEDGER_DATA, 'crunch', 601.32 * 83);
      expect(forecastResult.warning).not.toBeNull();
      expect(forecastResult.warning?.date).toBe('2026-07-17');
      expect(forecastResult.warning!.shortfall).toBeGreaterThan(0);
    });

    it('should draft a micro-loan letter containing shortfall figures for Crunch scenario', () => {
      const forecastResult = calculateForecast(CRUNCH_LEDGER_DATA, 'crunch', 601.32 * 83);
      expect(forecastResult.loanLetter).toContain('[Micro-Loan Request Letter - System Generated]');
      expect(forecastResult.loanLetter).toContain('short-term working capital');
    });

    it('should draft an expansion scaling proposal for Stable Growth scenario', () => {
      const forecastResult = calculateForecast(STABLE_LEDGER_DATA, 'stable', 8189.99 * 83);
      expect(forecastResult.loanLetter).toContain('[Pre-emptive Expansion & Strategic Scaling Request]');
      expect(forecastResult.loanLetter).toContain('Expansion Funding');
    });
  });
});

describe('Service Requests Workflows & Modals Integration Tests', () => {
  window.alert = vi.fn();

  const wrapProvider = (component: React.ReactNode) => {
    return render(<AppProvider>{component}</AppProvider>);
  };

  it('should render and filter TrackServiceRequestsModal list items', () => {
    const handleClose = vi.fn();
    wrapProvider(<TrackServiceRequestsModal onClose={handleClose} />);

    // Renders active service requests
    expect(screen.getByText('Track Service Requests')).toBeDefined();
    expect(screen.getByText('Address Change')).toBeDefined();
    expect(screen.getByText('Nominee Update')).toBeDefined();

    // Filters service request list items
    const searchInput = screen.getByPlaceholderText(/Search by SRN/i) as HTMLInputElement;
    fireEvent.change(searchInput, { target: { value: 'Address' } });
    expect(screen.queryByText('Nominee Update')).toBeNull();
    expect(screen.getByText('Address Change')).toBeDefined();
  });

  it('should complete AddressChangeModal forms validation and OTP flow', async () => {
    const handleClose = vi.fn();
    const { container } = wrapProvider(<AddressChangeModal onClose={handleClose} />);

    // Step 1: Input details
    const flatInput = screen.getByPlaceholderText(/e.g. Flat 402/i);
    const streetInput = screen.getByPlaceholderText(/e.g. Hitech City/i);
    const cityInput = screen.getByPlaceholderText(/e.g. Hyderabad/i);
    const pinInput = screen.getByPlaceholderText(/6-digit PIN/i);
    const stateInput = screen.getByPlaceholderText(/e.g. Telangana/i);

    // Mock drag and drop proof file upload
    const file = new File(['proof'], 'aadhaar.pdf', { type: 'application/pdf' });
    const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;
    fireEvent.change(fileInput, { target: { files: [file] } });

    fireEvent.change(flatInput, { target: { value: 'Flat 505' } });
    fireEvent.change(streetInput, { target: { value: 'Cyber Road' } });
    fireEvent.change(cityInput, { target: { value: 'Hyderabad' } });
    fireEvent.change(pinInput, { target: { value: '500081' } });
    fireEvent.change(stateInput, { target: { value: 'Telangana' } });

    fireEvent.click(screen.getByText('Proceed to Verification'));

    // Step 2: Verification OTP
    expect(screen.getByText('Enter 6-Digit OTP Code')).toBeDefined();

    // Click auto-fill verification code
    const autofillBtn = container.querySelector('div.bg-slate-900') as HTMLDivElement;
    fireEvent.click(autofillBtn);

    // Submit OTP verification
    vi.useFakeTimers();
    fireEvent.click(screen.getByText('Confirm & Save'));
    await act(async () => {
      vi.advanceTimersByTime(1500);
    });
    vi.useRealTimers();

    // Step 3: Success Screen
    expect(screen.getByText('Address Updated Successfully')).toBeDefined();
  });

  it('should validate matching PIN codes in GenerateCardPinModal', async () => {
    const handleClose = vi.fn();
    wrapProvider(<GenerateCardPinModal onClose={handleClose} />);

    expect(screen.getByText('Generate Card PIN')).toBeDefined();

    const expiryInput = screen.getByPlaceholderText('MM/YY');
    const cvvInput = screen.getByPlaceholderText('•••');
    const pinInput = screen.getAllByPlaceholderText('••••')[0];
    const confirmInput = screen.getAllByPlaceholderText('••••')[1];

    fireEvent.change(expiryInput, { target: { value: '12/28' } });
    fireEvent.change(cvvInput, { target: { value: '999' } });
    fireEvent.change(pinInput, { target: { value: '9845' } });
    fireEvent.change(confirmInput, { target: { value: '9845' } });

    vi.useFakeTimers();
    fireEvent.click(screen.getByText('Set Card PIN'));
    await act(async () => {
      vi.advanceTimersByTime(1500);
    });
    vi.useRealTimers();

    expect(screen.getByText('New PIN Generated Successfully')).toBeDefined();
  });

  it('should adjust range values in ManageCardLimitsModal', async () => {
    const handleClose = vi.fn();
    const { container } = wrapProvider(<ManageCardLimitsModal onClose={handleClose} />);

    expect(screen.getByText('Manage Card Limits')).toBeDefined();

    // Toggle international usage flag
    const toggleBtn = container.querySelector('button.relative.inline-flex') as HTMLButtonElement;
    fireEvent.click(toggleBtn);

    vi.useFakeTimers();
    fireEvent.click(screen.getByText('Save Preferences'));
    await act(async () => {
      vi.advanceTimersByTime(1500);
    });
    vi.useRealTimers();

    expect(screen.getByText('Limits Adjusted Successfully')).toBeDefined();
  });

  it('should update email address in UpdateEmailModal', async () => {
    const handleClose = vi.fn();
    const { container } = wrapProvider(<UpdateEmailModal onClose={handleClose} />);

    const emailInput = screen.getByPlaceholderText(/support@quantumcash.com/i);
    const confirmInput = screen.getByPlaceholderText(/Re-enter new email address/i);

    fireEvent.change(emailInput, { target: { value: 'admin@quantumcash.com' } });
    fireEvent.change(confirmInput, { target: { value: 'admin@quantumcash.com' } });

    fireEvent.click(screen.getByText('Get Verification OTP'));

    expect(screen.getByText('Email Update Authentication')).toBeDefined();

    // Click auto-fill verification code
    const autofillBtn = container.querySelector('div.bg-slate-900') as HTMLDivElement;
    fireEvent.click(autofillBtn);

    vi.useFakeTimers();
    fireEvent.click(screen.getByText('Verify & Save'));
    await act(async () => {
      vi.advanceTimersByTime(1500);
    });
    vi.useRealTimers();

    expect(screen.getByText('Email ID Updated Successfully')).toBeDefined();
  });

  it('should support nominee details editing and Guardian fields in NomineeManagementModal', async () => {
    const handleClose = vi.fn();
    const { container } = wrapProvider(<NomineeManagementModal onClose={handleClose} />);

    expect(screen.getByText('Gandikota Subbarao')).toBeDefined();

    // Click Modify beneficiary tab
    fireEvent.click(screen.getByText('Modify Beneficiary Allocation'));

    const nameInput = screen.getByPlaceholderText('Enter nominee name');
    const dobInput = container.querySelector('input[type="date"]') as HTMLInputElement;
    const allocInput = screen.getByPlaceholderText('100');

    fireEvent.change(nameInput, { target: { value: 'Gandikota Swarna' } });
    fireEvent.change(dobInput, { target: { value: '2015-08-20' } }); // minor (DOB < 18 years ago)
    fireEvent.change(allocInput, { target: { value: '100' } });

    // Renders Guardian details dynamically for minor nominee
    expect(screen.getByText('Minor Guardian Assignment Required')).toBeDefined();

    const guardianNameInput = screen.getByPlaceholderText('Enter legal guardian full name');
    const guardianAddrInput = screen.getByPlaceholderText('Enter guardian address');

    fireEvent.change(guardianNameInput, { target: { value: 'Gandikota Subbarao' } });
    fireEvent.change(guardianAddrInput, { target: { value: 'Quantum Towers, Hyderabad' } });

    vi.useFakeTimers();
    fireEvent.click(screen.getByText('Save Nominee'));
    await act(async () => {
      vi.advanceTimersByTime(1500);
    });
    vi.useRealTimers();

    expect(screen.getByText('Nominee Profile Synced Successfully')).toBeDefined();
  });

  it('should upgrade debit card tiers in UpgradeCardModal', async () => {
    const handleClose = vi.fn();
    wrapProvider(<UpgradeCardModal onClose={handleClose} />);

    expect(screen.getByText('Quantum Coral Platinum')).toBeDefined();

    // Select premium card card tier
    fireEvent.click(screen.getByText('Quantum Sapphire World'));

    // Confirm delivery checkbox
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeDefined();

    vi.useFakeTimers();
    fireEvent.click(screen.getByText('Upgrade & Order Card'));
    await act(async () => {
      vi.advanceTimersByTime(1500);
    });
    vi.useRealTimers();

    expect(screen.getByText('New Card Ordered Successfully')).toBeDefined();
  });

  it('should register cheques in PositivePayModal', async () => {
    const handleClose = vi.fn();
    const { container } = wrapProvider(<PositivePayModal onClose={handleClose} />);

    expect(screen.getByText('Positive Pay Cheque Verification')).toBeDefined();

    const chequeNoInput = screen.getByPlaceholderText('e.g. 123456');
    const payeeInput = screen.getByPlaceholderText('Enter payee full name');
    const amountInput = screen.getByPlaceholderText(/Cheque Amount/i);
    const dateInput = container.querySelector('input[type="date"]') as HTMLInputElement;

    fireEvent.change(chequeNoInput, { target: { value: '882910' } });
    fireEvent.change(payeeInput, { target: { value: 'Vendor Supply Corp' } });
    fireEvent.change(amountInput, { target: { value: '150000' } });
    fireEvent.change(dateInput, { target: { value: '2026-08-01' } });

    vi.useFakeTimers();
    fireEvent.click(screen.getByText('Register Cheque'));
    await act(async () => {
      vi.advanceTimersByTime(1500);
    });
    vi.useRealTimers();

    expect(screen.getByText('Cheque Registered Successfully')).toBeDefined();
  });

  it('should close wrapper overlay on backdrop click and Escape key', () => {
    const handleClose = vi.fn();
    const { container } = wrapProvider(
      <ServiceRequestModalWrapper requestType="Positive Pay" onClose={handleClose} />
    );

    // Press Escape key
    fireEvent.keyDown(window, { key: 'Escape', code: 'Escape' });
    expect(handleClose).toHaveBeenCalled();

    // Backdrop click-away
    const backdrop = container.firstChild as HTMLElement;
    fireEvent.click(backdrop);
    expect(handleClose).toHaveBeenCalled();
  });
});

describe('Customer Service Hub Integration Tests', () => {

  const wrapProvider = (component: React.ReactNode) => {
    return render(<AppProvider>{component}</AppProvider>);
  };

  it('should render CustomerServiceView and all 5 primary sections', () => {
    wrapProvider(<CustomerServiceView />);

    expect(screen.getByText('Customer Service & Help Center')).toBeDefined();
    expect(screen.getByText(/Emergency Assistance & Fraud Response/i)).toBeDefined();
    expect(screen.getByText('Quantum AI Assistant')).toBeDefined();
    expect(screen.getByText(/Self-Service FAQ & Troubleshooting Knowledgebase/i)).toBeDefined();
    expect(screen.getByText('1800-108-5555')).toBeDefined();
    expect(screen.getByText(/Branch & ATM Directory/i)).toBeDefined();
  });

  it('should submit a dispute ticket in RaiseDisputeModal', async () => {
    const handleClose = vi.fn();
    wrapProvider(<RaiseDisputeModal onClose={handleClose} />);

    expect(screen.getByText('Raise Ticket / Dispute Form')).toBeDefined();

    const descTextarea = screen.getByPlaceholderText(/Describe your issue or dispute rationale/i);
    fireEvent.change(descTextarea, { target: { value: 'Unauthorized fee of ₹500 charged on my debit card.' } });

    vi.useFakeTimers();
    fireEvent.click(screen.getByText('Submit Dispute'));
    await act(async () => {
      vi.advanceTimersByTime(1500);
    });
    vi.useRealTimers();

    expect(screen.getByText('Dispute Ticket Raised Successfully')).toBeDefined();
  });

  it('should freeze card when clicking Block Card Immediately in EmergencyQuickActions', async () => {
    wrapProvider(<EmergencyQuickActions />);

    fireEvent.click(screen.getByText(/Block Card Immediately/i));
    expect(screen.getByText('Instant Card Block')).toBeDefined();

    fireEvent.click(screen.getByText('Confirm & Block Card'));
    expect(screen.getByText('Card Blocked Successfully')).toBeDefined();
  });

  it('should switch to Customer Service view when clicking Customer Service in Dashboard sidebar', () => {
    wrapProvider(<Dashboard />);

    const customerServiceBtn = screen.getByRole('button', { name: /Customer Service/i });
    fireEvent.click(customerServiceBtn);

    expect(screen.getByText('Customer Service & Help Center')).toBeDefined();
  });
});

describe('Insurance Hub Integration Tests', () => {

  const wrapProvider = (component: React.ReactNode) => {
    return render(<AppProvider>{component}</AppProvider>);
  };

  it('should render InsuranceView and active policy holdings', () => {
    wrapProvider(<InsuranceView />);

    expect(screen.getByText('Insurance & Wealth Security Hub')).toBeDefined();
    expect(screen.getByText(/Active Policies \("My Holdings"\)/i)).toBeDefined();
    expect(screen.getByText('Quantum Term Life Shield')).toBeDefined();
    expect(screen.getByText('Quantum Health Care Shield')).toBeDefined();
    expect(screen.getByText(/Interactive Premium Calculator/i)).toBeDefined();
    expect(screen.getByText(/Insurance Marketplace & Instant Covers/i)).toBeDefined();
    expect(screen.getByText(/Claims Management Center/i)).toBeDefined();
  });

  it('should calculate dynamic premium quotes in InsuranceCalculator', () => {
    wrapProvider(<InsuranceCalculator />);

    expect(screen.getByText(/Interactive Premium Calculator/i)).toBeDefined();
    expect(screen.getByText(/Life Protection Plan/i)).toBeDefined();

    // Switch category tab to Health Shield
    fireEvent.click(screen.getByText('Health Shield'));
    expect(screen.getByText(/Health Protection Plan/i)).toBeDefined();
  });

  it('should complete instant policy purchase flow in BuyInsuranceModal', async () => {
    wrapProvider(<BuyInsuranceModal />);

    expect(screen.getByText('Cyber Fraud Guard')).toBeDefined();

    // Click Buy Instantly for Cyber Fraud Guard
    const buyBtns = screen.getAllByText('Buy Instantly');
    fireEvent.click(buyBtns[1]);

    expect(screen.getByText('Step 1: Coverage & Nominee Assignment')).toBeDefined();

    fireEvent.click(screen.getByText(/Proceed to Declaration/i));
    expect(screen.getByText(/Step 2: Good Health & Compliance Declaration/i)).toBeDefined();

    // Pay and issue policy
    vi.useFakeTimers();
    fireEvent.click(screen.getByText(/Issue Policy/i));
    await act(async () => {
      vi.advanceTimersByTime(1500);
    });
    vi.useRealTimers();

    expect(screen.getByText('Policy Issued Instantly!')).toBeDefined();
  });

  it('should file a new claim in InitiateClaimModal', async () => {
    const { container } = wrapProvider(<InitiateClaimModal />);

    fireEvent.click(screen.getByText('Initiate New Claim'));
    expect(screen.getByText('Initiate Insurance Claim')).toBeDefined();

    const dateInput = container.querySelector('input[type="date"]') as HTMLInputElement;
    const amountInput = screen.getByPlaceholderText('e.g. 50000');

    fireEvent.change(dateInput, { target: { value: '2026-07-01' } });
    fireEvent.change(amountInput, { target: { value: '25000' } });

    vi.useFakeTimers();
    fireEvent.click(screen.getByText('File Claim'));
    await act(async () => {
      vi.advanceTimersByTime(1500);
    });
    vi.useRealTimers();

    expect(screen.getByText('Claim Filed Successfully')).toBeDefined();
  });

  it('should switch to Insurance view when clicking Insurance in Dashboard sidebar', () => {
    wrapProvider(<Dashboard />);

    const insuranceBtn = screen.getByRole('button', { name: /Insurance/i });
    fireEvent.click(insuranceBtn);

    expect(screen.getByText('Insurance & Wealth Security Hub')).toBeDefined();
  });
});

describe('Offers For You Section Integration Tests', () => {

  const wrapProvider = (component: React.ReactNode) => {
    return render(<AppProvider>{component}</AppProvider>);
  };

  it('should render OffersSection on Overview dashboard', () => {
    wrapProvider(<Dashboard />);

    expect(screen.getByText('OFFERS FOR YOU')).toBeDefined();
    expect(screen.getByText('UNLOCK INSTANT OFFERS')).toBeDefined();
    expect(screen.getByText('Pre-approved Personal Loan')).toBeDefined();
    expect(screen.getByText('Pre-approved Car Loan')).toBeDefined();
  });

  it('should unlock offers via PAN/DOB security modal in UnlockOffersModal', async () => {
    wrapProvider(<UnlockOffersModal onClose={() => {}} />);

    const panInput = screen.getByPlaceholderText('e.g. ABCDE1234F');
    const dobInput = screen.getByLabelText(/Date of Birth/i);

    fireEvent.change(panInput, { target: { value: 'ABCDE1234F' } });
    fireEvent.change(dobInput, { target: { value: '1990-05-15' } });

    vi.useFakeTimers();
    fireEvent.click(screen.getByText('Fetch Instant Offers'));
    await act(async () => {
      vi.advanceTimersByTime(2000);
    });
    vi.useRealTimers();

    expect(screen.getByText('Offers Unlocked Successfully!')).toBeDefined();
  });

  it('should disburse Personal Loan and update state in PersonalLoanOfferModal', async () => {
    wrapProvider(<PersonalLoanOfferModal onClose={() => {}} />);

    expect(screen.getByText(/Personal Loan Instant Disbursal/i)).toBeDefined();
    expect(screen.getByText(/Estimated Monthly EMI/i)).toBeDefined();

    vi.useFakeTimers();
    fireEvent.click(screen.getByText(/Disburse Now/i));
    await act(async () => {
      vi.advanceTimersByTime(2000);
    });
    vi.useRealTimers();

    expect(screen.getByText('Funds Disbursed Instantly!')).toBeDefined();
  });

  it('should generate digital Car Loan sanction letter in CarLoanOfferModal', async () => {
    wrapProvider(<CarLoanOfferModal onClose={() => {}} />);

    expect(screen.getByText(/Car Loan Digital Approval/i)).toBeDefined();

    vi.useFakeTimers();
    fireEvent.click(screen.getByText('Generate Sanction Letter'));
    await act(async () => {
      vi.advanceTimersByTime(1500);
    });
    vi.useRealTimers();

    expect(screen.getByText('In-Principle Sanction Certificate')).toBeDefined();
    expect(screen.getByText(/Download PDF/i)).toBeDefined();
  });

  it('should activate virtual credit card in CreditCardOfferModal', async () => {
    wrapProvider(<CreditCardOfferModal onClose={() => {}} />);

    expect(screen.getByText(/Instant Virtual Credit Card/i)).toBeDefined();
    expect(screen.getByText(/QUANTUM SAPPHIRE WORLD/i)).toBeDefined();

    vi.useFakeTimers();
    fireEvent.click(screen.getByText('Accept & Activate Card'));
    await act(async () => {
      vi.advanceTimersByTime(1800);
    });
    vi.useRealTimers();

    expect(screen.getByText('Virtual Card Activated!')).toBeDefined();
  });
});

describe('Upcoming Payments Header Hub Integration Tests', () => {

  const wrapProvider = (component: React.ReactNode) => {
    return render(<AppProvider>{component}</AppProvider>);
  };

  it('should render UpcomingPaymentsPill with dynamic counter in header', () => {
    wrapProvider(<UpcomingPaymentsPill />);

    expect(screen.getByText(/UPCOMING PAYMENT/i)).toBeDefined();
  });

  it('should open UpcomingPaymentsDrawer on pill click and display pending dues', () => {
    wrapProvider(<UpcomingPaymentsPill />);

    const pillBtn = screen.getByRole('button', { name: /UPCOMING PAYMENT/i });
    fireEvent.click(pillBtn);

    expect(screen.getByText('Upcoming Payments Hub')).toBeDefined();
    expect(screen.getByText('Quantum Signature Credit Card Bill')).toBeDefined();
    expect(screen.getByText('Electricity Bill (TSSPDCL Hyderabad)')).toBeDefined();
  });

  it('should settle an upcoming bill payment in UpcomingPaymentsDrawer', () => {
    wrapProvider(<UpcomingPaymentsDrawer onClose={() => {}} />);

    expect(screen.getByText('Quantum Signature Credit Card Bill')).toBeDefined();

    const payBtns = screen.getAllByText('Pay Now');
    fireEvent.click(payBtns[0]);

    expect(screen.getByText('Settle Upcoming Bill')).toBeDefined();

    fireEvent.click(screen.getByText(/Confirm & Pay/i));
    expect(screen.getByText('Payment Settled Successfully')).toBeDefined();
  });

  it('should add a new payment reminder in AddReminderModal', () => {
    const { container } = wrapProvider(<AddReminderModal onClose={() => {}} />);

    expect(screen.getByText('Add New Payment Reminder')).toBeDefined();

    const payeeInput = screen.getByPlaceholderText('e.g. TSSPDCL Electricity / Apartment Rent');
    const amountInput = screen.getByPlaceholderText('e.g. 3500');
    const dateInput = container.querySelector('#reminder-due-date') as HTMLInputElement;

    fireEvent.change(payeeInput, { target: { value: 'Water Bill Maintenance' } });
    fireEvent.change(amountInput, { target: { value: '1200' } });
    fireEvent.change(dateInput, { target: { value: '2026-08-10' } });

    fireEvent.click(screen.getByText('Save Reminder'));
  });
});

describe('Demo System & Guided Walkthrough Integration Tests', () => {

  const wrapProvider = (component: React.ReactNode) => {
    return render(<AppProvider>{component}</AppProvider>);
  };

  it('should render ResetDemoModal and restore baseline state on confirmation', async () => {
    wrapProvider(<ResetDemoModal onClose={() => {}} />);

    expect(screen.getByText('Reset QuantumCash Demo Data')).toBeDefined();
    expect(screen.getByText(/Confirm Factory Reset/i)).toBeDefined();

    vi.useFakeTimers();
    fireEvent.click(screen.getByText(/Confirm Factory Reset/i));
    await act(async () => {
      vi.advanceTimersByTime(2000);
    });
    vi.useRealTimers();

    expect(screen.getByText('Demo State Reset Successfully!')).toBeDefined();
  });

  it('should render GuidedTourModal and step through walkthrough tooltips', () => {
    wrapProvider(<GuidedTourModal onClose={() => {}} />);

    expect(screen.getByText('INTERACTIVE PRODUCT TOUR')).toBeDefined();
    expect(screen.getAllByText('Step 1: Security & Header Hub')[0]).toBeDefined();

    // Next step
    fireEvent.click(screen.getByText('Next'));
    expect(screen.getAllByText('Step 2: Accounts Overview')[0]).toBeDefined();

    // Next step
    fireEvent.click(screen.getByText('Next'));
    expect(screen.getAllByText('Step 3: AI Cash-Flow Predictive Models')[0]).toBeDefined();
  });

  it('should open dropdown options in DemoMenuDropdown', () => {
    wrapProvider(<DemoMenuDropdown />);

    const menuBtn = screen.getByRole('button', { name: /View \/ Reset Demo/i });
    fireEvent.click(menuBtn);

    expect(screen.getByText('Reset Factory State')).toBeDefined();
    expect(screen.getByText('Start Guided Product Tour')).toBeDefined();
  });
});

describe('Overview Quick Actions & Statement Modal Integration Tests', () => {

  const wrapProvider = (component: React.ReactNode) => {
    return render(<AppProvider>{component}</AppProvider>);
  };

  it('should render OverviewQuickActions and launch modals on click', () => {
    wrapProvider(<OverviewQuickActions />);

    expect(screen.getByText('Send Money')).toBeDefined();
    expect(screen.getByText('View Statement')).toBeDefined();
    expect(screen.getByText('Pay Bills')).toBeDefined();

    fireEvent.click(screen.getByText('Send Money'));
    expect(screen.getByText('Send Money / Fund Transfer')).toBeDefined();
  });

  it('should complete IMPS transfer in SendMoneyModal', async () => {
    wrapProvider(<SendMoneyModal onClose={() => {}} />);

    const payeeInput = screen.getByPlaceholderText('e.g. Lalitha Subramanyam');
    const accInput = screen.getByPlaceholderText('e.g. 065801928');
    const confirmAccInput = screen.getByPlaceholderText('Re-enter Acc No');
    const amtInput = screen.getByPlaceholderText('e.g. 5000');

    fireEvent.change(payeeInput, { target: { value: 'Lalitha Subramanyam' } });
    fireEvent.change(accInput, { target: { value: '065801928' } });
    fireEvent.change(confirmAccInput, { target: { value: '065801928' } });
    fireEvent.change(amtInput, { target: { value: '1500' } });

    fireEvent.click(screen.getByText('Proceed →'));

    expect(screen.getByText('Transaction Security Authorization')).toBeDefined();

    const pinInput = screen.getByPlaceholderText('••••');
    fireEvent.change(pinInput, { target: { value: '1234' } });

    vi.useFakeTimers();
    fireEvent.click(screen.getByText('Authorize & Send'));
    await act(async () => {
      vi.advanceTimersByTime(1500);
    });
    vi.useRealTimers();

    expect(screen.getByText('Transfer Completed!')).toBeDefined();
  });

  it('should settle utility bill in PayBillsModal', async () => {
    wrapProvider(<PayBillsModal onClose={() => {}} />);

    expect(screen.getByText('BBPS Bill Payment Hub')).toBeDefined();

    const consumerInput = screen.getByPlaceholderText('e.g. 1092830192');
    fireEvent.change(consumerInput, { target: { value: '1092830192' } });

    const payBtn = screen.getByRole('button', { name: /Pay ₹2,840/i });

    vi.useFakeTimers();
    fireEvent.click(payBtn);
    await act(async () => {
      await vi.advanceTimersByTimeAsync(2000);
    });
    vi.useRealTimers();

    expect(screen.getByText('Bill Paid Successfully!')).toBeDefined();
  });

  it('should render TransactionStatementModal and trigger CSV/PDF export', () => {
    wrapProvider(<TransactionStatementModal onClose={() => {}} />);

    expect(screen.getByText('Detailed Account Statement')).toBeDefined();
    expect(screen.getByText('SWIGGY FOOD ORDER HYD')).toBeDefined();
    expect(screen.getByText('VIVISH TECH SOLUTIONS PVT LTD')).toBeDefined();

    const downloadBtn = screen.getByRole('button', { name: /DOWNLOAD/i });
    fireEvent.click(downloadBtn);

    // Switch to XLS and click download
    fireEvent.click(screen.getByText('XLS'));
    fireEvent.click(downloadBtn);

    expect(screen.getByText(/QuantumCash_Statement_July2026.csv generated successfully!/i)).toBeDefined();
  });

  it('should render RecentTransactions with top 7 activity items', () => {
    wrapProvider(<RecentTransactions />);

    expect(screen.getByText('Recent Activity & Ledger Log')).toBeDefined();
    expect(screen.getByText('STARTING BUSINESS BALANCE')).toBeDefined();
  });

  it('should filter transactions progressively by date range and calculate summary metrics', () => {
    const baseRecords = getFormattedStatementData(STABLE_LEDGER_DATA as any, 'stable');

    const last7 = filterTransactionsByDateRange(baseRecords, 'Last 7 Days', 'stable');
    expect(last7.filteredRecords.length).toBeGreaterThan(0);

    const fy = filterTransactionsByDateRange(baseRecords, 'Financial Year', 'stable');
    expect(fy.filteredRecords.length).toBeGreaterThan(last7.filteredRecords.length);
    expect(fy.summaryMetrics.totalInflow).toBeGreaterThan(0);
    expect(fy.summaryMetrics.totalOutflow).toBeGreaterThan(0);
  });

  it('should toggle segment tabs in OverviewPortfolioTabs', () => {
    wrapProvider(<OverviewPortfolioTabs />);

    expect(screen.getByText('ACCOUNTS PORTFOLIO SUMMARY')).toBeDefined();
    expect(screen.getByText('Stable Growth Operating Account')).toBeDefined();

    // Toggle to DEPOSITS
    fireEvent.click(screen.getByRole('button', { name: 'DEPOSITS' }));
    expect(screen.getByText('DEPOSITS PORTFOLIO SUMMARY')).toBeDefined();
    expect(screen.getByText('Fixed Deposit (FD)')).toBeDefined();

    // Toggle to INVESTMENTS
    fireEvent.click(screen.getByRole('button', { name: 'INVESTMENTS' }));
    expect(screen.getByText('INVESTMENTS PORTFOLIO SUMMARY')).toBeDefined();
    expect(screen.getByText('SSY (Sukanya)')).toBeDefined();
  });

  it('should render CardsView distinctly with security controls and card flip widget', () => {
    wrapProvider(<CardsView />);

    expect(screen.getByText('Debit & Credit Card Controls')).toBeDefined();
    expect(screen.getByText('Quantum Sapphire Credit Card')).toBeDefined();
    expect(screen.getByText('Card Security & Usage Controls')).toBeDefined();
    expect(screen.getByText('Daily Spend Limit Threshold')).toBeDefined();
  });

  it('should render LoansView with active borrowings and EMI payment action', () => {
    wrapProvider(<LoansView />);

    expect(screen.getByText('Active Borrowings & EMI Center')).toBeDefined();
    expect(screen.getByText('QC-LN-771029')).toBeDefined();
    expect(screen.getByText('QC-LN-330192')).toBeDefined();
    expect(screen.getByText('QC-LN-884011')).toBeDefined();
    expect(screen.getAllByRole('button', { name: /Pay EMI Now/i })).toHaveLength(3);
  });

  it('should execute transfers in PaymentTransferView', () => {
    wrapProvider(<PaymentTransferView />);

    expect(screen.getByText('Funds Transfer & Bill Payment Center')).toBeDefined();
    expect(screen.getByText('Stable Growth Account')).toBeDefined();
    expect(screen.getByText('Cash Crunch Account')).toBeDefined();

    const amountInput = screen.getByPlaceholderText('e.g. 15000');
    fireEvent.change(amountInput, { target: { value: '5000' } });

    const transferBtn = screen.getByRole('button', { name: /Transfer Now/i });
    fireEvent.click(transferBtn);

    expect(screen.getByText(/Transfer of ₹5,000\.00 successful! UTR:/i)).toBeDefined();
  });

  it('should navigate to Cards and Loans distinctly from Sidebar in Dashboard', () => {
    wrapProvider(<Dashboard />);

    // Click Cards menu item
    const cardsBtn = screen.getByRole('button', { name: /Cards/i });
    fireEvent.click(cardsBtn);
    expect(screen.getByText('Debit & Credit Card Controls')).toBeDefined();
    expect(screen.queryByText('Active Borrowings & EMI Center')).toBeNull();

    // Click Loans menu item
    const loansBtn = screen.getByRole('button', { name: /Loans/i });
    fireEvent.click(loansBtn);
    expect(screen.getByText('Active Borrowings & EMI Center')).toBeDefined();
    expect(screen.queryByText('Debit & Credit Card Controls')).toBeNull();
  });

  it('should support targeted account dispatch in addTransaction and update balances zero-latency', () => {
    let contextValue: any;
    const TestComp = () => {
      contextValue = useApp();
      return <div>Balances: {contextValue.getAccountBalances().crunch}</div>;
    };

    wrapProvider(<TestComp />);

    const initialCrunchBal = contextValue.getAccountBalances().crunch;
    expect(initialCrunchBal).toBeGreaterThan(0);

    // Dispatch debit targeting Cash Crunch account explicitly
    act(() => {
      contextValue.addTransaction('OUTFLOW', 'Overhead', 2000, 'Targeted Cash Crunch Outflow', 'crunch');
    });

    const newCrunchBal = contextValue.getAccountBalances().crunch;
    expect(newCrunchBal).toBe(parseFloat((initialCrunchBal - 2000).toFixed(2)));
  });

  describe('Site-Wide Real-Time Transaction Prepend Integration Tests', () => {
    it('Test 1 (Bill Pay): should prepend DEBIT transaction at index 0 on Pay Bills', () => {
      let contextValue: any;
      const TestComp = () => {
        contextValue = useApp();
        return <div>Balances</div>;
      };

      wrapProvider(<TestComp />);

      const initialBal = contextValue.getAccountBalances().stable;

      act(() => {
        contextValue.addTransaction('OUTFLOW', 'BBPS', 2840, 'Electricity Bill Payment (TSSPDCL)');
      });

      const newBal = contextValue.getAccountBalances().stable;
      expect(newBal).toBe(parseFloat((initialBal - 2840).toFixed(2)));

      const statementRecords = getFormattedStatementData(contextValue.transactions, 'stable');
      expect(statementRecords[0].payeeName).toBe('ELECTRICITY BILL PAYMENT (TSSPDCL)');
      expect(statementRecords[0].type).toBe('DEBIT');
    });

    it('Test 2 (Upcoming Payments): should prepend DEBIT transaction at index 0 on Upcoming Payments settlement', () => {
      let contextValue: any;
      const TestComp = () => {
        contextValue = useApp();
        return <div>Upcoming Payments</div>;
      };

      wrapProvider(<TestComp />);

      const initialCount = contextValue.upcomingPayments.length;

      act(() => {
        contextValue.payUpcomingPayment('pay-cc-1', 'stable');
      });

      expect(contextValue.upcomingPayments.length).toBe(initialCount - 1);
      const statementRecords = getFormattedStatementData(contextValue.transactions, 'stable');
      expect(statementRecords[0].payeeName).toContain('QUANTUM SIGNATURE CREDIT CARD BILL');
      expect(statementRecords[0].type).toBe('DEBIT');
    });

    it('Test 3 (Insurance): should prepend DEBIT transaction at index 0 on Insurance premium payment', () => {
      let contextValue: any;
      const TestComp = () => {
        contextValue = useApp();
        return <div>Insurance</div>;
      };

      wrapProvider(<TestComp />);

      act(() => {
        contextValue.payPolicyPremium('pol-life-1', 'stable');
      });

      const statementRecords = getFormattedStatementData(contextValue.transactions, 'stable');
      expect(statementRecords[0].payeeName).toContain('QUANTUM TERM LIFE SHIELD');
      expect(statementRecords[0].type).toBe('DEBIT');
    });

    it('Test 4 (Loan Disbursal): should prepend CREDIT transaction at index 0 on Personal Loan disbursal', () => {
      let contextValue: any;
      const TestComp = () => {
        contextValue = useApp();
        return <div>Loans</div>;
      };

      wrapProvider(<TestComp />);

      const initialBal = contextValue.getAccountBalances().stable;

      act(() => {
        contextValue.disbursePersonalLoan(100000, 24, 'stable');
      });

      const newBal = contextValue.getAccountBalances().stable;
      expect(newBal).toBe(parseFloat((initialBal + 100000).toFixed(2)));

      const statementRecords = getFormattedStatementData(contextValue.transactions, 'stable');
      expect(statementRecords[0].payeeName).toContain('INSTANT PERSONAL LOAN CREDIT');
      expect(statementRecords[0].type).toBe('CREDIT');
    });
  });

  describe('Brand Logo Navigation & Deposit/Investment Creation Tests', () => {
    it('should navigate back to Overview on QuantumCash brand logo click', () => {
      wrapProvider(<Dashboard />);

      // Switch to Cards tab
      fireEvent.click(screen.getByRole('button', { name: /Cards/i }));
      expect(screen.getByText('Debit & Credit Card Controls')).toBeDefined();

      // Click Brand Logo
      const logoBtn = screen.getByTitle('Go to Overview Home');
      fireEvent.click(logoBtn);

      expect(screen.getByText('Quick Banking Actions')).toBeDefined();
    });

    it('should open new deposit, deduct balance, and log transaction', () => {
      let createdDep: any = null;
      wrapProvider(
        <OpenDepositModal
          onClose={() => {}}
          onDepositCreated={(dep) => { createdDep = dep; }}
        />
      );

      expect(screen.getByText('Open New Deposit Account')).toBeDefined();

      const amountInput = screen.getByPlaceholderText('e.g. 50000');
      fireEvent.change(amountInput, { target: { value: '25000' } });

      const submitBtn = screen.getByRole('button', { name: 'Book Deposit Now' });
      fireEvent.click(submitBtn);

      expect(createdDep).not.toBeNull();
      expect(createdDep.principal).toBe(25000);
      expect(createdDep.type).toBe('FD');
    });

    it('should add investment top-up, increase portfolio total, and log transaction', () => {
      let addedCat = '';
      let addedAmt = 0;
      wrapProvider(
        <AddInvestmentModal
          onClose={() => {}}
          onInvestmentAdded={(cat, amt) => {
            addedCat = cat;
            addedAmt = amt;
          }}
        />
      );

      expect(screen.getByText('Add Investment / Top-Up')).toBeDefined();

      const amountInput = screen.getByPlaceholderText('e.g. 10000');
      fireEvent.change(amountInput, { target: { value: '15000' } });

      const submitBtn = screen.getByRole('button', { name: 'Confirm Investment Top-Up' });
      fireEvent.click(submitBtn);

      expect(addedCat).toBe('Equity');
      expect(addedAmt).toBe(15000);
    });
  });

  describe('Math Rounding, Smart Buckets & Cash Crunch Deficit View Tests', () => {
    it('should satisfy row-by-row cash flow mathematical equality: End = Start + Inflow - Outflow', () => {
      let contextValue: any;
      const TestComp = () => {
        contextValue = useApp();
        return <div>Forecast</div>;
      };

      wrapProvider(<TestComp />);

      const forecast = contextValue.getForecast();
      expect(forecast.projection.length).toBe(7);

      forecast.projection.forEach((row: any) => {
        const expectedEnd = Number((row.start + row.in - row.out).toFixed(2));
        expect(row.end).toBe(expectedEnd);
      });
    });

    it('should render Smart Wallet Buckets with non-zero progress utilization metrics', () => {
      let contextValue: any;
      const TestComp = () => {
        contextValue = useApp();
        return <div>Buckets</div>;
      };

      wrapProvider(<TestComp />);

      const buckets = contextValue.buckets;
      expect(buckets.length).toBeGreaterThan(0);
      buckets.forEach((b: any) => {
        expect(b.percentage).toBeGreaterThan(0);
      });
    });

    it('should navigate to Cash Crunch account predictive view and display DEFICIT WARNING', () => {
      wrapProvider(<Dashboard />);

      // Click Cash Crunch Card
      const crunchCard = screen.getByText('Cash Crunch Liquidity Buffer Account');
      fireEvent.click(crunchCard);

      expect(screen.getByText('Cash Crunch Account')).toBeDefined();
      expect(screen.getByText('TREASURY STANDING: DEFICIT WARNING')).toBeDefined();
    });
  });

  describe('System Blueprint & Dedicated Architecture Flowchart Canvas Tests', () => {
    it('should open dedicated SystemArchitectureModal flowchart canvas without tab headers', () => {
      wrapProvider(<Dashboard />);

      const blueprintBtn = screen.getByText(/View System Architecture & Technical Blueprint/i);
      fireEvent.click(blueprintBtn);

      expect(screen.getByText(/QuantumCash 3.0 System Architecture & Execution Flowchart/i)).toBeDefined();
      expect(screen.queryByText('GitHub README.md')).toBeNull();
      expect(screen.queryByText('LinkedIn Launch Post')).toBeNull();
    });

    it('should inspect multi-tier flowchart nodes and display inspector drawer details', () => {
      let closed = false;
      wrapProvider(<SystemArchitectureModal onClose={() => { closed = true; }} />);

      expect(screen.getByText(/QuantumCash 3.0 System Architecture & Execution Flowchart/i)).toBeDefined();

      // Click node 2.1 (Unified Event Interceptor)
      const node2_1 = screen.getByText('2.1 Unified Event Interceptor');
      fireEvent.click(node2_1);
      expect(screen.getByText(/Listens for financial actions across all views/i)).toBeDefined();

      // Click node 3.1 (2-Decimal Currency Precision Engine)
      const node3_1 = screen.getByText('3.1 2-Decimal Currency Precision Engine');
      fireEvent.click(node3_1);
      expect(screen.getByText(/Eliminates IEEE 754 floating-point drift errors/i)).toBeDefined();

      // Click node 3.3 (Amortization & EMI Calculation Engine)
      const node3_3 = screen.getByText('3.3 Amortization & EMI Calculation Engine');
      fireEvent.click(node3_3);
      expect(screen.getByText(/EMI = P \* r \* \(1\+r\)\^n/i)).toBeDefined();

      // Click node 6.1 (Netlify Hosting & Security Target)
      const node6_1 = screen.getByText('6.1 Netlify Hosting & Security Target');
      fireEvent.click(node6_1);
      expect(screen.getByText(/Configures single-page application routing/i)).toBeDefined();

      // Press ESC key to close modal
      fireEvent.keyDown(window, { key: 'Escape', code: 'Escape' });
      expect(closed).toBe(true);
    });
  });

  describe('Master Mathematical Audit & Precision Verification Tests', () => {
    it('should assert Portfolio Sums equality across Accounts, Deposits, and Investments', () => {
      let contextValue: any;
      const TestComp = () => {
        contextValue = useApp();
        return <div>Audit</div>;
      };

      wrapProvider(<TestComp />);

      const balances = contextValue.getAccountBalances();
      const accountsTotal = roundCurrency(balances.stable + balances.crunch);
      expect(accountsTotal).toBe(roundCurrency(balances.stable + balances.crunch));

      const depositsTotal = roundCurrency(250000 + 155261);
      expect(depositsTotal).toBe(405261.00);

      const investmentsTotal = roundCurrency(863035 + 470946 + 200000);
      expect(investmentsTotal).toBe(1533981.00);
    });

    it('should reconcile transaction ledger mutations and balance continuity', () => {
      let contextValue: any;
      const TestComp = () => {
        contextValue = useApp();
        return <div>Ledger</div>;
      };

      wrapProvider(<TestComp />);

      const initialBal = contextValue.getAccountBalances().stable;
      act(() => {
        contextValue.addTransaction('OUTFLOW', 'Utilities', 5000, 'Electric Bill', 'stable');
        contextValue.addTransaction('INFLOW', 'Sales', 15000, 'Invoice Settlement', 'stable');
      });

      const expectedBal = roundCurrency(initialBal - 5000 + 15000);
      const updatedBal = contextValue.getAccountBalances().stable;
      expect(updatedBal).toBe(expectedBal);
    });

    it('should enforce T+7 projection row math equality and chain rule continuity', () => {
      let contextValue: any;
      const TestComp = () => {
        contextValue = useApp();
        return <div>Projection</div>;
      };

      wrapProvider(<TestComp />);

      const forecast = contextValue.getForecast();
      expect(forecast.projection.length).toBe(7);

      for (let i = 0; i < forecast.projection.length; i++) {
        const row = forecast.projection[i];
        const expectedEnd = roundCurrency(row.start + row.in - row.out);
        expect(row.end).toBe(expectedEnd);

        if (i > 0) {
          const prevRow = forecast.projection[i - 1];
          expect(row.start).toBe(prevRow.end);
        }
      }
    });

    it('should verify standard banking EMI calculation formula accuracy', () => {
      const emiVal = calculateEMI(500000, 10.5, 36);
      expect(emiVal).toBeGreaterThan(16000);
      expect(emiVal).toBeLessThan(17000);
      expect(emiVal).toBe(16251.22);
    });

    it('should calculate non-zero Smart Wallet Bucket percentage utilization without NaN', () => {
      let contextValue: any;
      const TestComp = () => {
        contextValue = useApp();
        return <div>Buckets</div>;
      };

      wrapProvider(<TestComp />);

      const buckets = contextValue.buckets;
      buckets.forEach((b: any) => {
        expect(b.percentage).toBeGreaterThan(0);
        expect(isNaN(b.percentage)).toBe(false);
      });
    });
  });
});
