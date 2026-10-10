const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const STORAGE = { admissions: 'sps_demo_admissions', receipts: 'sps_demo_receipts' };
const readStore = key => { try { return JSON.parse(localStorage.getItem(key) || '[]'); } catch { return []; } };
const writeStore = (key, value) => localStorage.setItem(key, JSON.stringify(value));
const makeId = (prefix) => prefix + '-' + Math.random().toString(36).slice(2, 8).toUpperCase();

const toast = (message) => {
  const el = $('#toast'); el.textContent = message; el.classList.add('show');
  clearTimeout(toast.timer); toast.timer = setTimeout(() => el.classList.remove('show'), 3200);
};
const showMessage = (element, message, error = false) => {
  element.textContent = message; element.classList.toggle('error', error);
};

// Mobile navigation
$('#menuToggle').addEventListener('click', () => $('#mainNav').classList.toggle('open'));
$$('#mainNav a').forEach(link => link.addEventListener('click', () => $('#mainNav').classList.remove('open')));

// Modal controls
$$('[data-modal]').forEach(button => button.addEventListener('click', () => {
  const modal = $('#' + button.dataset.modal); if (modal) modal.classList.add('open');
}));
$$('.modal-close').forEach(button => button.addEventListener('click', () => button.closest('.modal-backdrop').classList.remove('open')));
$$('.modal-backdrop').forEach(backdrop => backdrop.addEventListener('click', e => {
  if (e.target === backdrop) backdrop.classList.remove('open');
}));
document.addEventListener('keydown', e => { if (e.key === 'Escape') $$('.modal-backdrop.open').forEach(m => m.classList.remove('open')); });

// Admission form: browser-local demo only
$('#admissionForm').addEventListener('submit', e => {
  e.preventDefault();
  const form = e.currentTarget; const data = Object.fromEntries(new FormData(form).entries());
  data.applicationId = makeId('SPS'); data.status = 'Application received (demo)'; data.submittedAt = new Date().toISOString();
  const admissions = readStore(STORAGE.admissions); admissions.push(data); writeStore(STORAGE.admissions, admissions);
  showMessage($('#admissionMessage'), `Application submitted for this demo. Your application number is ${data.applicationId}. Save it to check status later.`);
  toast('Demo application saved in this browser.'); form.reset();
});

// Fee calculator and mock transaction
const feeAmounts = { tuition: 8500, admission: 5000, transport: 3000, exam: 1200 };
const feeNames = { tuition: 'Tuition fee', admission: 'Admission fee', transport: 'Transport fee', exam: 'Examination fee' };
const formatMoney = value => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value);
$('#feeType').addEventListener('change', e => { $('#feeAmount').textContent = formatMoney(feeAmounts[e.target.value]); });
$('#paymentForm').addEventListener('submit', e => {
  e.preventDefault();
  const form = e.currentTarget; const data = Object.fromEntries(new FormData(form).entries());
  const receipt = { reference: makeId('DEMO'), studentId: data.studentId.trim(), studentName: data.payStudentName.trim(), feeType: data.feeType, feeName: feeNames[data.feeType], amount: feeAmounts[data.feeType], paidAt: new Date().toISOString(), status: 'DEMO ONLY — NOT A REAL PAYMENT' };
  const receipts = readStore(STORAGE.receipts); receipts.push(receipt); writeStore(STORAGE.receipts, receipts);
  showMessage($('#paymentMessage'), `Demo transaction created: ${receipt.reference}. Amount ${formatMoney(receipt.amount)} was NOT charged. Use this reference in “Find Fee Receipt”.`);
  toast('Demo transaction created; no money was charged.');
  form.reset(); $('#feeAmount').textContent = formatMoney(feeAmounts.tuition);
});

// Demo login interaction; no real authentication
$('#loginForm').addEventListener('submit', e => {
  e.preventDefault(); showMessage($('#loginMessage'), 'This is a UI prototype. Real login needs a Java backend, password hashing and role-based access.');
});

// Admission status lookup
$('#statusForm').addEventListener('submit', e => {
  e.preventDefault(); const id = $('#statusNumber').value.trim().toUpperCase();
  const record = readStore(STORAGE.admissions).find(item => item.applicationId.toUpperCase() === id);
  showMessage($('#statusMessage'), record ? `Application found for ${record.studentName}. Current status: ${record.status}. (Demo record)` : 'No matching demo application found in this browser. Submit an application here first and use its application number.', !record);
});

// Receipt lookup and print
$('#receiptForm').addEventListener('submit', e => {
  e.preventDefault(); const id = $('#receiptNumber').value.trim().toUpperCase();
  const record = readStore(STORAGE.receipts).find(item => item.reference.toUpperCase() === id);
  if (!record) { showMessage($('#receiptMessage'), 'No matching demo receipt found in this browser. Create a demo transaction first.', true); return; }
  const message = `Receipt: ${record.reference} | ${record.studentName} (${record.studentId}) | ${record.feeName}: ${formatMoney(record.amount)} | ${new Date(record.paidAt).toLocaleString('en-IN')} | ${record.status}`;
  showMessage($('#receiptMessage'), message);
  const printButton = document.createElement('button'); printButton.type = 'button'; printButton.className = 'btn btn-outline'; printButton.textContent = 'Print demo receipt';
  printButton.addEventListener('click', () => {
    const win = window.open('', '_blank', 'width=700,height=600');
    if (!win) { toast('Please allow pop-ups to print the receipt.'); return; }
    win.document.write(`<html><head><title>Demo Fee Receipt</title><style>body{font:15px Arial;padding:35px;color:#173653}h1{color:#0879e8}table{border-collapse:collapse;width:100%;margin:25px 0}td{padding:12px;border:1px solid #ddd}small{color:#b23b3b}</style></head><body><h1>Sunrise Public School</h1><h2>Demo Fee Receipt</h2><small>DEMO ONLY — NOT PROOF OF REAL PAYMENT</small><table><tr><td>Transaction reference</td><td>${record.reference}</td></tr><tr><td>Student</td><td>${record.studentName}</td></tr><tr><td>Student ID</td><td>${record.studentId}</td></tr><tr><td>Fee category</td><td>${record.feeName}</td></tr><tr><td>Amount</td><td>${formatMoney(record.amount)}</td></tr><tr><td>Date</td><td>${new Date(record.paidAt).toLocaleString('en-IN')}</td></tr><tr><td>Status</td><td>${record.status}</td></tr></table><p>This receipt is generated by an educational prototype. No money was collected.</p><script>window.onload=()=>window.print()<\/script></body></html>`);
    win.document.close();
  });
  $('#receiptMessage').after(printButton);
});
