import * as firebaseAdmin from "firebase-admin";
import * as functions from "firebase-functions";
import stripe from "./stripe/config";

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

    return new_user;
  }
);
