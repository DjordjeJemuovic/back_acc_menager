const API_URL = "http://localhost:8000/api";

// Jedna funkcija kroz koju prolaze svi pozivi, pa se greške obrađuju na jednom mestu
async function request(path, options = {}) {
  let res;
  try {
    res = await fetch(`${API_URL}${path}`, options);
  } catch {
    throw new Error("Server is not reachable. Is the backend running?");
  }

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    // Naše greške iz Pythona stižu kao tekst u "detail"
    const detail = data && typeof data.detail === "string" ? data.detail : "Invalid data.";
    throw new Error(detail);
  }
  return data;
}

function postJson(path, body) {
  return request(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

export function getAccounts() {
  return request("/accounts");
}

export function getAccount(name) {
  return request(`/accounts/${encodeURIComponent(name)}`);
}

export function createAccount(name, balance) {
  return postJson("/accounts", { name, balance });
}

// type je "deposit" ili "withdraw", isto kao ruta u Pythonu
export function makeTransaction(type, name, amount) {
  return postJson(`/accounts/${encodeURIComponent(name)}/${type}`, { amount });
}