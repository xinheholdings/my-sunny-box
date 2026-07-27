export function normalizeEmail(value: unknown) {
  return typeof value === "string" ? value.trim().toLowerCase() : "";
}

export function validEmail(email: string) {
  return email.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function validPassword(password: unknown): password is string {
  return (
    typeof password === "string" &&
    password.length >= 10 &&
    password.length <= 128
  );
}

export function validDisplayName(value: unknown) {
  return typeof value === "string" && value.trim().length >= 2 && value.trim().length <= 50;
}
