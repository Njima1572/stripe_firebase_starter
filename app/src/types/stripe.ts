export interface Wallet {
  billing_details: {
    name: string;
  };
  card: {
    brand: string;
    country: string;
    exp_month: number;
    exp_year: number;
    last4: string;
  };
  id: string;
}

export interface Product {
  id: string;
  name: string;
  prices: Price[];
}

export interface Price {
  id: string;
  product: string;
  currency: string;
  unit_amount: number;
  recurring: {
    interval: "month" | "year" | "day" | "week";
    interval_count: number;
  };
}

export interface Plan {
  id: string;
  interval: string;
  interval_count: number;
  currency: string;
  amount: number;
  product: Product | string;
}

export enum SubscriptionStatus {
  active = "active",
  incomplete = "incomplete",
  incomplete_expired = "incomplete_expired",
  trialing = "trialing",
  past_due = "past_due",
  canceled = "canceled",
  unpaid = "unpaid",
}

export interface Subscription {
  id: string;
  current_period_end: number;
  current_period_start: number;
  status: SubscriptionStatus;
  default_payment_method: Wallet;
  latest_invoice: Invoice;
  collection_method: string;
  days_until_due: string;
  canceled_at: number;
  plan: Plan;
  items: { data: SubscriptionItem[] };
}

export interface SubscriptionItem {
  id: string;
  plan: Plan;
  price: Price;
}

export interface Invoice {
  id: string;
  account_name: string;
  amount_paid: string;
  amount_due: string;
  invoice_pdf_url: string;
  total: number;
  status: string;
}
