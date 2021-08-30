import { functions } from "../FIREBASE_CONFIG";

export const signup = functions("signup");
export const get_price = functions("get_price");
export const list_prices = functions("list_prices");
// get_product implicitly does list_prices at the backend for the convenience
export const get_product = functions("get_product");
export const get_user_data = functions("get_user_data");
export const get_subscription = functions("get_subscription");
export const get_invoice = functions("get_invoice");
export const attach_payment_method = functions("attach_payment_method");
export const list_payment_methods = functions("list_payment_methods");
export const start_subscription = functions("start_subscription");
export const cancel_subscription = functions("cancel_subscription");
export const list_subscriptions = functions("list_subscriptions");
export const create_billing_portal = functions("create_billing_portal");
export const change_subscription_plan = functions("change_subscription_plan");
export const update_subscription_payment_source = functions(
  "update_subscription_payment_source"
);
