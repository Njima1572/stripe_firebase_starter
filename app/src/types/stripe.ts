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
    interval: "month" | "year";
    interval_count: number;
  };
}

enum SubscriptionStatus {
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
  plan: Price;
  current_period_end: number;
  current_period_start: number;
  default_payment_method: string;
  latest_invoice: string;
  status: SubscriptionStatus;
}
