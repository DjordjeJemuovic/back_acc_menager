import { getAccounts, getAccount, createAccount, makeTransaction } from "./api.js";
import { validateName, parseAmount } from "./validation.js";
import {
  renderSummary, hideSummary, renderAccounts, renderAccountSelect,
  showMessage, clearMessage, formatMoney,
} from "./ui.js";

// ---- Elementi sa stranice ----
const findForm = document.getElementById("find-form");
const findName = document.getElementById("find-name");
const findMessage = document.getElementById("find-message");

const newAccountBtn = document.getElementById("new-account-btn");
const newAccountForm = document.getElementById("new-account-form");
const newName = document.getElementById("new-name");
const newBalance = document.getElementById("new-balance");
const newAccountMessage = document.getElementById("new-account-message");
const accountsMessage = document.getElementById("accounts-message");

const transactionForm = document.getElementById("transaction-form");
const accountSelect = document.getElementById("account-select");
const amountInput = document.getElementById("amount");
const txMessage = document.getElementById("tx-message");

// ---- Učitavanje liste računa (lista + select u Transactions) ----
async function refreshAccounts() {
  try {
    const accounts = await getAccounts();
    renderAccounts(accounts);
    renderAccountSelect(accounts);
    clearMessage(accountsMessage);
  } catch (err) {
    showMessage(accountsMessage, err.message);
  }
}

// ---- Overview: pronađi klijenta ----
findForm.addEventListener("submit", async (e) => {
  e.preventDefault();   // bez ovoga bi forma osvežila stranicu
  const name = findName.value.trim();

  if (!name) {
    showMessage(findMessage, "Enter a name.");
    return;
  }

  try {
    const account = await getAccount(name);
    clearMessage(findMessage);
    renderSummary(account);
  } catch (err) {
    hideSummary();
    showMessage(findMessage, err.message);
  }
});

// ---- Accounts: otvori/zatvori formu ----
newAccountBtn.addEventListener("click", () => {
  newAccountForm.hidden = !newAccountForm.hidden;
});

// ---- Accounts: napravi račun ----
newAccountForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = newName.value.trim();

  if (!validateName(name)) {
    showMessage(newAccountMessage, "Name must contain 2-50 letters.");
    return;
  }

  let balance = 0;
  if (newBalance.value.trim() !== "") {
    balance = parseAmount(newBalance.value);
    if (balance === null) {
      showMessage(newAccountMessage, "Initial balance must be a positive number, e.g. 100.50.");
      return;
    }
  }

  try {
    await createAccount(name, balance);
    showMessage(newAccountMessage, "Account created.", false);
    newAccountForm.reset();
    await refreshAccounts();
  } catch (err) {
    showMessage(newAccountMessage, err.message);
  }
});

// ---- Transactions: deposit / withdraw ----
transactionForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const type = transactionForm.querySelector('input[name="type"]:checked').value;
  const name = accountSelect.value;
  const amount = parseAmount(amountInput.value);

  if (!name) {
    showMessage(txMessage, "Select an account.");
    return;
  }
  if (amount === null) {
    showMessage(txMessage, "Amount must be a positive number, e.g. 25.50.");
    return;
  }

  const button = transactionForm.querySelector('button[type="submit"]');
  button.disabled = true;   // sprečava dupli klik = dupla uplata

  try {
    const result = await makeTransaction(type, name, amount);
    showMessage(txMessage, `Done. New balance: ${formatMoney(result.balance)}`, false);
    amountInput.value = "";
    await refreshAccounts();
  } catch (err) {
    showMessage(txMessage, err.message);
  } finally {
    button.disabled = false;
  }
});

// ---- Start ----
refreshAccounts();