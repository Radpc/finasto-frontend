export const realToNumber = (realString: string) => {
  return parseFloat(realString.replace(".", "").replace(",", "."));
};
