const money = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

export function formatMoney(value) {
  return money.format(Number(value));
}

export function showMessage(el, text, isError = true) {
  el.textContent = text;
  el.className = isError ? "message error" : "message success";
}

export function clearMessage(el) {
  el.textContent = "";
}

export function renderSummary(account) {
  document.getElementById("summary-name").textContent = account.owner;
  document.getElementById("summary-balance").textContent = formatMoney(account.balance);
  document.getElementById("summary").hidden = false;
}

export function hideSummary() {
  document.getElementById("summary").hidden = true;
}

export function renderAccounts(accounts) {
  document.getElementById("accounts-count").textContent = `${accounts.length} accounts`;

  const list = document.getElementById("accounts-list");
  list.replaceChildren();

  for (const acc of accounts) {
    const row = document.createElement("div");
    row.className = "list-row";

    const title = document.createElement("div");
    title.className = "list-title";
    title.textContent = acc.owner;

    const left = document.createElement("div");
    left.append(title);

    const amount = document.createElement("div");
    amount.className = "amount";
    amount.textContent = formatMoney(acc.balance);

    row.append(left, amount);
    list.append(row);
  }
}

export function renderAccountSelect(accounts) {
  const select = document.getElementById("account-select");
  const selected = select.value;   // zapamti izbor pre osvežavanja

  select.replaceChildren(new Option("Select account", ""));
  for (const acc of accounts) {
    select.append(new Option(`${acc.owner} · ${formatMoney(acc.balance)}`, acc.owner));
  }
  select.value = selected;
}