import { functions } from "../FIREBASE_CONFIG";

export const signup = functions<any, any>("signup");
export const get_price = functions<any, any>("get_price");
export const list_prices = functions<any, any>("list_prices");
// get_product implicitly does list_prices at the backend for the convenience
export const get_product = functions<any, any>("get_product");
export const get_user_data = functions<any, any>("get_user_data");
export const get_subscription = functions<any, any>("get_subscription");
export const get_invoice = functions<any, any>("get_invoice");
export const attach_payment_method = functions<any, any>(
  "attach_payment_method"
);
export const list_payment_methods = functions<any, any>("list_payment_methods");
export const start_subscription = functions<any, any>("start_subscription");
export const cancel_subscription = functions<any, any>("cancel_subscription");
export const list_subscriptions = functions<any, any>("list_subscriptions");
export const create_billing_portal = functions<any, any>(
  "create_billing_portal"
);
export const change_subscription_plan = functions<any, any>(
  "change_subscription_plan"
);
export const update_subscription_payment_source = functions<any, any>(
  "update_subscription_payment_source"
);
