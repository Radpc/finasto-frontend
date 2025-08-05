export const currencyToNumber = (realString: string) => {
  return parseFloat(realString.replace(".", "").replace(",", "."));
};
