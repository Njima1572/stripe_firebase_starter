import { functions } from "../FIREBASE_CONFIG";

export const signup = functions("signup");
export const get_price = functions("get_price");
export const get_product = functions("get_product");
export const get_user_data = functions("get_user_data");
export const attach_payment_method = functions("attach_payment_method");
export const list_payment_methods = functions("list_payment_methods");
export const start_subscription = functions("start_subscription");
export const cancel_subscription = functions("cancel_subscription");
export const list_subscriptions = functions("list_subscriptions");
export const create_billing_portal = functions("create_billing_portal");
