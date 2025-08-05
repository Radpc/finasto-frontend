import { Mask } from "react-text-mask";
import createNumberMask from "text-mask-addons/dist/createNumberMask";

const n = /\d/; //number
const l = /\D/; //letter
const nl = /[a-zA-Z0-9]/; //number and letter

export const unmask = (value: string) => value.replace(/[^a-zA-Z0-9]/g, "");
export const unmaskCurrency = (value: string) => value?.replace(/,/g, ".");

export const maskCep: Mask = [n, n, n, n, n, "-", n, n, n];
export const maskCpf: Mask = [n, n, n, ".", n, n, n, ".", n, n, n, "-", n, n];
export const maskCnpj: Mask = [
  n,
  n,
  ".",
  n,
  n,
  n,
  ".",
  n,
  n,
  n,
  "/",
  n,
  n,
  n,
  n,
  "-",
  n,
  n,
];
export const maskDDD: Mask = ["(", n, n, ")"];
export const maskPhone: Mask = [" ", n, n, n, n, n, "-", n, n, n, n];
export const maskFullPhone: Mask = [...maskDDD, ...maskPhone];
export const maskDate: Mask = [n, n, "/", n, n, "/", n, n, n, n];
export const maskAgency: Mask = [n, n, n, n];
export const maskAgencyNumberAccount: Mask = [n, n, n, n, n, n, n, n];
export const maskAgencyDigit: Mask = [n];
const semiAccessCodeEnding = [n, n, n, n];
const semiAccessCode = [...semiAccessCodeEnding, "-"];
export const maskAccessCode: Mask = [
  ...Array.from({ length: 10 })
    .map((_, i) => semiAccessCode)
    .flat(),
  ...semiAccessCodeEnding,
];

export const maskRg = (value: string) => {
  let formattedValue = value.replace(/[^\dA-Za-z]/g, "");

  if (formattedValue.length === 8) {
    formattedValue = formattedValue.replace(
      /(\d{2})(\d{3})(\d{2})([0-9X])/,
      "$1.$2.$3-$4"
    );
  } else if (formattedValue.length === 9) {
    formattedValue = formattedValue.replace(
      /(\d{2})(\d{3})(\d{3})([0-9X])/,
      "$1.$2.$3-$4"
    );
  } else if (formattedValue.length === 10) {
    formattedValue = formattedValue.replace(
      /(\d{2})(\d{3})(\d{3})(MG)/,
      "$1.$2.$3-$4"
    );
  }

  return formattedValue;
};

export const maskDateYearVehicle: Mask = [n, n, n, n];
export const maskPlate = [l, l, l, "-", n, nl, n, n];

export const maskInvoice: Mask = Array.from({ length: 9 }, (_, index) => n);

export const maskDigit: Mask = [n];

const defaultNumberoptions = {
  prefix: "",
  suffix: "",
  includeThousandsSeparator: false,
  decimalSymbol: ",",
  integerLimit: 7,
  allowNegative: false,
  allowLeadingZeroes: false,
};

export const maskFloat: Mask = createNumberMask({
  ...defaultNumberoptions,
  allowDecimal: true,
  decimalLimit: 2,
});

export const maskGeopoint: Mask = createNumberMask({
  ...defaultNumberoptions,
  allowDecimal: true,
  decimalLimit: 14,
  allowNegative: true,
});

export const maskInt: Mask = createNumberMask({
  ...defaultNumberoptions,
  allowDecimal: false,
});
