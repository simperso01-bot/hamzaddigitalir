const faDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
const arDigits = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];

export function fa(input: string | number): string {
  return String(input).replace(/[0-9\u0660-\u0669]/g, (d) => {
    const i = "0123456789".indexOf(d);
    if (i !== -1) return faDigits[i];
    const ai = arDigits.indexOf(d);
    return ai !== -1 ? faDigits[ai] : d;
  });
}

export function toLatinDigits(input: string): string {
  return String(input).replace(/[۰-۹٠-٩]/g, (d) => {
    const i = faDigits.indexOf(d);
    if (i !== -1) return String(i);
    const ai = arDigits.indexOf(d);
    return ai !== -1 ? String(ai) : d;
  });
}
