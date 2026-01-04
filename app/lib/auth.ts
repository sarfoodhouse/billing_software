const AUTH_KEY = "sar_auth";

const VALID_PHONE = "9999999999";   // change to your number
const VALID_PASSWORD = "sar@123";   // change to your secret

export function checkCredentials(phone: string, password: string): boolean {
  return phone === VALID_PHONE && password === VALID_PASSWORD;
}

export function setAuthenticated() {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(AUTH_KEY, "1");
}

export function clearAuthenticated() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(AUTH_KEY);
}

export function isAuthenticated(): boolean {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(AUTH_KEY) === "1";
}
