export function isString(str: any) {
  if (typeof str !== "string") return false;

  return true;
}

export function validEmail(email: string) {
  const regex = new RegExp("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9-]+\\.[a-zA-Z]{2,}$");
  const test = regex.test(email);
  return test;
}

export function isNumber(number: any) {
  if (typeof number === "number") return true;
  return false;
}

export function isAlphaNum(str: string) {
  const number = Number(str);
  return !isNaN(number);
}

export function isArray(arr: any) {
  return Array.isArray(arr);
}
