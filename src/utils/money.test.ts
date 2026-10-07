import { describe, expect, it } from "vitest";
import { currencyToNumber } from "./money";

describe("currencyToNumber", () => {
  it.each([
    ["10,50", 10.5],
    ["1.234,56", 1234.56],
    ["1.234.567,89", 1234567.89],
    ["R$ 2.000,00", 2000],
    ["-15,00", -15],
  ])("parses %s", (input, expected) => {
    expect(currencyToNumber(input)).toBe(expected);
  });
});
