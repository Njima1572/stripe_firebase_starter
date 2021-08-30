import * as firebaseAdmin from "firebase-admin";
import * as functions from "firebase-functions";
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

export const get_price = functions.https.onCall(
  async (price_id: string, context: functions.https.CallableContext) => {
    // First create customer with Stripe
    if (context.auth) {
      return await stripe.prices.retrieve(price_id);
    }
    return {};
  }
);

export const get_product = functions.https.onCall(
  async (product_id: string, context: functions.https.CallableContext) => {
    // First create customer with Stripe
    if (context.auth) {
      return await stripe.products.retrieve(product_id);
    }
    return {};
  }
);
