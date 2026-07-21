const fs = require('fs');
const path = require('path');

function parseCSV(fileName) {
  const filePath = path.join(__dirname, '..', 'temp_legacy_repo', fileName);
  if (!fs.existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}`);
  }
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split(/\r?\n/).filter(line => line.trim() !== '');
  const headers = lines[0].split(',').map(h => h.trim());
  
  const transactions = [];
  lines.slice(1).forEach(line => {
    const cols = line.split(',').map(c => c.trim());
    if (cols.length < headers.length) return;
    
    const txn = {};
    headers.forEach((h, idx) => {
      txn[h] = cols[idx];
    });
    
    // Parse types
    txn.amount = parseFloat(txn.amount);
    txn.description = txn.description || '';
    transactions.push(txn);
  });
  
  return transactions;
}

const stableTxns = parseCSV('ledger_stable.csv');
const crunchTxns = parseCSV('ledger_crunch.csv');

// Write src/ledger_data.ts
const codeContent = `// Automatically parsed from legacy ledgers
import { Transaction } from './types';

export const STABLE_LEDGER_DATA: Transaction[] = ${JSON.stringify(stableTxns, null, 2)};

export const CRUNCH_LEDGER_DATA: Transaction[] = ${JSON.stringify(crunchTxns, null, 2)};
`;

fs.writeFileSync(path.join(__dirname, '..', 'src', 'ledger_data.ts'), codeContent);
console.log('Successfully wrote src/ledger_data.ts!');
