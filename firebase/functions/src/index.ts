import * as firebaseAdmin from "firebase-admin";
import * as functions from "firebase-functions";
import Stripe from "stripe";
import stripe from "./stripe/config";
firebaseAdmin.initializeApp();
import handleWebhook from "./stripe/webhook";

const auth = firebaseAdmin.auth();
const db = firebaseAdmin.firestore();

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

export const on_create_user = functions
  .region("asia-northeast1")
  .auth.user()
  .onCreate(async (user: firebaseAdmin.auth.UserRecord) => {
    // Create a database entry here with empty data
    const batch = db.batch();
    const account_ref = db.collection("accounts").doc(user.uid);
    batch.set(account_ref, {
      id: user.uid,
      email: user.email,
      subscription_id: "",
      tier: 0,
      valid_until: 0,
      status: "UNSUBSCRIBED",
    });
    await batch.commit();
    return true;
  });

export const on_delete_user = functions
  .region("asia-northeast1")
  .auth.user()
  .onDelete(async (user: firebaseAdmin.auth.UserRecord) => {
    const batch = db.batch();
    const account_ref = db.collection("accounts").doc(user.uid);
    let account_data = await account_ref.get();
    let subscription_id: string = account_data.data()?.subscription_id || "";
    if (subscription_id !== "") {
      stripe.subscriptions.del(subscription_id);
    }
    batch.delete(account_ref);
    await batch.commit();
    return true;
  });

// context.auth.uid is stripe customer_id, no params needed
export const get_user_data = functions.https.onCall(
  async (_data, context: functions.https.CallableContext) => {
    // First create customer with Stripe
    if (context.auth) {
      try {
        const customer = await stripe.customers.retrieve(context.auth.uid, {
          expand: ["subscriptions"],
        });
        return customer;
      } catch (e) {
        throw new functions.https.HttpsError("aborted", e.message);
      }
    }
    throw new functions.https.HttpsError(
      "unauthenticated",
      "You need to be logged in to perform this action"
    );
  }
);

// ========= Payment Methods Begin ========
export const attach_payment_method = functions.https.onCall(
  async (
    data: { payment_method_id: string },
    context: functions.https.CallableContext
  ) => {
    if (context.auth) {
      try {
        return stripe.paymentMethods.attach(data.payment_method_id, {
          customer: context.auth.uid,
        });
      } catch (e) {
        throw new functions.https.HttpsError("aborted", e.message);
      }
    }
    throw new functions.https.HttpsError(
      "unauthenticated",
      "You need to be logged in to perform this action"
    );
  }
);

export const list_payment_methods = functions.https.onCall(
  async (_data, context: functions.https.CallableContext) => {
    if (context.auth) {
      try {
        let paymentMethods = await stripe.paymentMethods.list({
          customer: context.auth.uid,
          type: "card",
        });
        return paymentMethods.data;
      } catch (e) {
        throw new functions.https.HttpsError("aborted", e.message);
      }
    }
    throw new functions.https.HttpsError(
      "unauthenticated",
      "You need to be logged in to perform this action"
    );
  }
);

export const set_default_payment_method = functions.https.onCall(
  async (
    data: { payment_method_id: string },
    context: functions.https.CallableContext
  ) => {
    if (context.auth) {
      try {
        return stripe.customers.update(context.auth.uid, {
          invoice_settings: {
            default_payment_method: data.payment_method_id,
          },
        });
      } catch (e) {
        throw new functions.https.HttpsError("aborted", e.message);
      }
    }
    throw new functions.https.HttpsError(
      "unauthenticated",
      "You need to be logged in to perform this action"
    );
  }
);
// ========= Payment Methods End ========

// ========= Products Start ========
export const get_price = functions.https.onCall(
  async (price_id: string, context: functions.https.CallableContext) => {
    // First create customer with Stripe
    if (context.auth) {
      try {
        return await stripe.prices.retrieve(price_id);
      } catch (e) {
        throw new functions.https.HttpsError("aborted", e.message);
      }
    }
    throw new functions.https.HttpsError(
      "unauthenticated",
      "You need to be logged in to perform this action"
    );
  }
);

export const list_prices = functions.https.onCall(
  async (
    data: Stripe.PriceListParams,
    context: functions.https.CallableContext
  ) => {
    if (context.auth) {
      try {
        let prices = await stripe.prices.list(data);
        return prices.data;
      } catch (e) {
        throw new functions.https.HttpsError("aborted", e.message);
      }
    }
    throw new functions.https.HttpsError(
      "unauthenticated",
      "You need to be logged in to perform this action"
    );
  }
);

export const get_product = functions.https.onCall(
  async (product_id: string, context: functions.https.CallableContext) => {
    // First create customer with Stripe
    if (context.auth) {
      try {
        let { data } = await stripe.prices.list({ product: product_id });
        let product = await stripe.products.retrieve(product_id);
        return { ...product, prices: data };
      } catch (e) {
        throw new functions.https.HttpsError("aborted", e.message);
      }
    }
    throw new functions.https.HttpsError(
      "unauthenticated",
      "You need to be logged in to perform this action"
    );
  }
);
// ========= Products End  ==========

// ========= Subscriptions Start ===========
export const get_subscription = functions.https.onCall(
  async (subscription_id: string, context: functions.https.CallableContext) => {
    if (context.auth) {
      try {
        return await stripe.subscriptions.retrieve(subscription_id, {
          expand: ["default_payment_method", "latest_invoice", "plan.product"],
        });
      } catch (e) {
        throw new functions.https.HttpsError("aborted", e.message);
      }
    }
    throw new functions.https.HttpsError(
      "unauthenticated",
      "You need to be logged in to perform this action"
    );
  }
);

export const list_subscriptions = functions.https.onCall(
  async (_data: any, context: functions.https.CallableContext) => {
    if (context.auth) {
      try {
        let { data } = await stripe.subscriptions.list({
          customer: context.auth.uid,
        });
        return data;
      } catch (e) {
        throw new functions.https.HttpsError("aborted", e.message);
      }
    }
    throw new functions.https.HttpsError(
      "unauthenticated",
      "You need to be logged in to perform this action"
    );
  }
);
export const start_subscription = functions.https.onCall(
  async (
    data: { price_id: string; payment_method_id: string },
    context: functions.https.CallableContext
  ) => {
    if (context.auth) {
      try {
        return await stripe.subscriptions.create({
          customer: context.auth.uid,
          items: [{ price: data.price_id }],
          default_payment_method: data.payment_method_id,
          payment_behavior: "default_incomplete",
        });
      } catch (e) {
        throw new functions.https.HttpsError("aborted", e.message);
      }
    }
    throw new functions.https.HttpsError(
      "unauthenticated",
      "You need to be logged in to perform this action"
    );
  }
);

export const cancel_subscription = functions.https.onCall(
  async (subscription_id: string, context: functions.https.CallableContext) => {
    if (context.auth) {
      try {
        return await stripe.subscriptions.del(subscription_id);
      } catch (e) {
        throw new functions.https.HttpsError("aborted", e.message);
      }
    }
    throw new functions.https.HttpsError(
      "unauthenticated",
      "You need to be logged in to perform this action"
    );
  }
);

export const update_subscription_payment_source = functions.https.onCall(
  async (
    data: { subscription_id: string; payment_method_id: string },
    context: functions.https.CallableContext
  ) => {
    if (context.auth) {
      try {
        return await stripe.subscriptions.update(data.subscription_id, {
          default_payment_method: data.payment_method_id,
        });
      } catch (e) {
        throw new functions.https.HttpsError("aborted", e.message);
      }
    }
    throw new functions.https.HttpsError(
      "unauthenticated",
      "You need to be logged in to perform this action"
    );
  }
);

export const get_invoice = functions.https.onCall(
  async (invoice_id: string, context: functions.https.CallableContext) => {
    if (context.auth) {
      try {
        return await stripe.invoices.retrieve(invoice_id);
      } catch (e) {
        throw new functions.https.HttpsError("aborted", e.message);
      }
    }
    throw new functions.https.HttpsError(
      "unauthenticated",
      "You need to be logged in to perform this action"
    );
  }
);

export const pay_invoice = functions.https.onCall(
  async (invoice_id: string, context: functions.https.CallableContext) => {
    if (context.auth) {
      const invoice = await stripe.invoices.retrieve(invoice_id);
      try {
        if (invoice.status === "draft") {
          await stripe.invoices.finalizeInvoice(invoice_id);
          return await stripe.invoices.pay(invoice_id);
        } else if (invoice.status === "open") {
          return await stripe.invoices.pay(invoice_id);
        }
      } catch (e) {
        throw new functions.https.HttpsError("aborted", e.message);
      }
    }
    throw new functions.https.HttpsError(
      "unauthenticated",
      "You need to be logged in to perform this action"
    );
  }
);

export const get_payment_intent = functions.https.onCall(
  async (
    payment_intent_id: string,
    context: functions.https.CallableContext
  ) => {
    if (context.auth) {
      try {
        return await stripe.paymentIntents.retrieve(payment_intent_id);
      } catch (e) {
        throw new functions.https.HttpsError("aborted", e.message);
      }
    }
    throw new functions.https.HttpsError(
      "unauthenticated",
      "You need to be logged in to perform this action"
    );
  }
);

export const change_subscription_plan = functions.https.onCall(
  async (
    data: {
      subscription_id: string;
      new_price_id: string;
    },
    context: functions.https.CallableContext
  ) => {
    if (context.auth) {
      console.log(data);
      try {
        let current_subscription = await stripe.subscriptions.retrieve(
          data.subscription_id
        );
        let res = await stripe.subscriptions.update(data.subscription_id, {
          items: [
            {
              id: current_subscription.items.data[0].id,
              price: data.new_price_id,
            },
          ],
          proration_behavior: "none",
          trial_end: current_subscription.current_period_end,
        });
        console.log(res);
        return res;
      } catch (e) {
        console.error(e);
        throw new functions.https.HttpsError("aborted", e.message);
      }
    }
    throw new functions.https.HttpsError(
      "unauthenticated",
      "You need to be logged in to perform this action"
    );
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
    throw new functions.https.HttpsError(
      "unauthenticated",
      "You need to be logged in to perform this action"
    );
  }
);

export const webhook = functions.https.onRequest(
  (req: functions.https.Request, res: functions.Response) => {
    console.log("Got Request");
    console.log(req.body.type);
    handleWebhook(req, res);
  }
);
