/**
 * Parses a pt-BR formatted amount ("1.234.567,89", "R$ 10,50") into a number.
 * Dots are thousands separators and the comma is the decimal separator.
 */
export const currencyToNumber = (realString: string) => {
  const normalized = realString
    .replace(/[^\d,.-]/g, "")
    .replace(/\./g, "")
    .replace(",", ".");
  return parseFloat(normalized);
};
