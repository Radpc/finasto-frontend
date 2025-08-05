export enum UserRole {
  FamilyHead = "familyHead",
  FamilyMember = "familyMember",
}

export enum PaymentStatus {
  Paid = "Paid",
}

export enum PaymentMethod {
  Credit = "Credit",
  Debit = "Debit",
  Cash = "Cash",
  Pix = "Pix",
}

export interface DatabaseDates {
  createdAt: string;
  updatedAt: string;
}

export interface User extends DatabaseDates {
  id: string;
  email: string;
  name: string;
  role: UserRole;

  families?: Family[];
}

export interface Payment extends DatabaseDates {
  id: string;
  description: string;
  value: number;
  observation?: string;
  status: PaymentStatus;
  paymentDate: string;
  paymentMethod: PaymentMethod;
  category?: Category;
  tags?: Tag[];
}

export interface Family extends DatabaseDates {
  id: string;
  name: string;
}

export interface Account extends DatabaseDates {
  id: string;
  name: string;
}

export interface Category extends DatabaseDates {
  id: string;
  label: string;
}

export interface Tag extends DatabaseDates {
  id: string;
  label: string;
}

export interface RecurringPayment extends DatabaseDates {
  id: string;
  description: string;
  paymentMethod: PaymentMethod;
  totalValue?: number;
  automaticPayment: boolean;
  singlePaymentValue: number;
  numberOfInstallments?: number;
  dayOfMonth: number;

  payments?: Payment[];
  account?: Account;
  category?: Category;
}
