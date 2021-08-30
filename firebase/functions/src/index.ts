import * as firebaseAdmin from "firebase-admin";
import * as functions from "firebase-functions";
import Stripe from "stripe";
import stripe from "./stripe/config";
firebaseAdmin.initializeApp();

const auth = firebaseAdmin.auth();
// const db = firebaseAdmin.firestore();

export const test = functions.https.onCall((_data, _context) => {
  functions.logger.info("Hello logs!", { structuredData: true });
  return "hello world";
});

// Auth
export const signup = functions.https.onCall(
  async (data: { email: string; password: string }, _context) => {
    functions.logger.info(data, { structuredData: true });

    // First create customer with Stripe
    const customer = await stripe.customers.create({
      email: data.email,
    });

    // Then create user with firebase
    const new_user = await auth.createUser({
      uid: customer.id,
      email: data.email,
      password: data.password,
      disabled: false,
      emailVerified: true,
    });

    // Create an entry in database here

    return new_user;
  }
);
// context.auth.uid is stripe customer_id, no params needed
export const get_user_data = functions.https.onCall(
  async (_data, context: functions.https.CallableContext) => {
    // First create customer with Stripe
    if (context.auth) {
      const customer = await stripe.customers.retrieve(context.auth.uid);
      return customer;
    }
    return {};
  }
);

// ========= Payment Methods Begin ========
export const attach_payment_method = functions.https.onCall(
  async (
    data: { payment_method_id: string },
    context: functions.https.CallableContext
  ) => {
    if (context.auth) {
      return stripe.paymentMethods.attach(data.payment_method_id, {
        customer: context.auth.uid,
      });
    }
    return {};
  }
);

export const list_payment_methods = functions.https.onCall(
  async (_data, context: functions.https.CallableContext) => {
    if (context.auth) {
      let paymentMethods = await stripe.paymentMethods.list({
        customer: context.auth.uid,
        type: "card",
      });
      return paymentMethods.data;
    }
    return [];
  }
);

export const set_default_payment_method = functions.https.onCall(
  async (
    data: { payment_method_id: string },
    context: functions.https.CallableContext
  ) => {
    if (context.auth) {
      return stripe.customers.update(context.auth.uid, {
        invoice_settings: {
          default_payment_method: data.payment_method_id,
        },
      });
    }
    return {};
  }
);
// ========= Payment Methods End ========

// ========= Products Start ========
export const get_price = functions.https.onCall(
  async (price_id: string, context: functions.https.CallableContext) => {
    // First create customer with Stripe
    if (context.auth) {
      return await stripe.prices.retrieve(price_id);
    }
    return {};
  }
);

export const list_prices = functions.https.onCall(
  async (
    data: Stripe.PriceListParams,
    context: functions.https.CallableContext
  ) => {
    if (context.auth) {
      let prices = await stripe.prices.list(data);
      return prices.data;
    }
    return {};
  }
);

export const get_product = functions.https.onCall(
  async (product_id: string, context: functions.https.CallableContext) => {
    // First create customer with Stripe
    if (context.auth) {
      let { data } = await stripe.prices.list({ product: product_id });
      let product = await stripe.products.retrieve(product_id);
      return { ...product, prices: data };
    }
    return {};
  }
);
// ========= Products End  ==========

// ========= Subscriptions Start ===========
export const get_subscription = functions.https.onCall(
  async (subscription_id: string, context: functions.https.CallableContext) => {
    if (context.auth) {
      return await stripe.subscriptions.retrieve(subscription_id);
    }
    return {};
  }
);

export const list_subscriptions = functions.https.onCall(
  async (_data: any, context: functions.https.CallableContext) => {
    if (context.auth) {
      let { data } = await stripe.subscriptions.list({
        customer: context.auth.uid,
      });
      return data;
    }
    return {};
  }
);
export const start_subscription = functions.https.onCall(
  async (
    data: { price_id: string; payment_method_id: string },
    context: functions.https.CallableContext
  ) => {
    if (context.auth) {
      return await stripe.subscriptions.create({
        customer: context.auth.uid,
        items: [{ price: data.price_id }],
        default_payment_method: data.payment_method_id,
      });
    }
    return {};
  }
);

export const cancel_subscription = functions.https.onCall(
  async (subscription_id: string, context: functions.https.CallableContext) => {
    if (context.auth) {
      return await stripe.subscriptions.del(subscription_id);
    }
    return {};
  }
);

export const update_subscription_payment_source = functions.https.onCall(
  async (
    data: { subscription_id: string; payment_method_id: string },
    context: functions.https.CallableContext
  ) => {
    if (context.auth) {
      return await stripe.subscriptions.update(data.subscription_id, {
        default_payment_method: data.payment_method_id,
      });
    }
    return {};
  }
);

export const get_invoice = functions.https.onCall(
  async (invoice_id: string, context: functions.https.CallableContext) => {
    if (context.auth) {
      return await stripe.invoices.retrieve(invoice_id);
    }
    return {};
  }
);

export const change_subscription_plan = functions.https.onCall(
  async (
    data: { subscription_id: string; new_price_items: any[] },
    context: functions.https.CallableContext
  ) => {
    if (context.auth) {
      return await stripe.subscriptions.update(data.subscription_id, {
        items: data.new_price_items,
      });
    }
    return {};
  }
);

// ========= Subscriptions End ===========

export const create_billing_portal = functions.https.onCall(
  async (_data: any, context: functions.https.CallableContext) => {
    if (context.auth) {
      return await stripe.billingPortal.sessions.create({
        customer: context.auth.uid,
        return_url: "http://localhost:3200",
      });
    }
    return {};
  }
);
