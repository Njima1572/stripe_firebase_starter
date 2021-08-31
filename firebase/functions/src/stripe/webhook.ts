import * as firebaseAdmin from "firebase-admin";
import * as functions from "firebase-functions";
import stripe from "./config";
const db = firebaseAdmin.firestore();

interface Account {
  subscription_id: string;
}

const handleWebhook = async (
  req: functions.https.Request,
  res: functions.Response
) => {
  // Verify the signature
  const endpointSecret = functions.config().stripe.endpoint_secret;
  const sig: any = req.headers["stripe-signature"];
  try {
    stripe.webhooks.constructEvent(req.rawBody, sig, endpointSecret);
  } catch (err) {
    console.error("Webhook Secret not verified");
    // res.status(400).send(`Webhook Error: ${err.message}`);
    res.send("Error");
    return;
  }
  let target_object = req.body.data.object;
  const batch = db.batch();
  const account_ref = db.collection("accounts").doc(target_object.customer);
  const account_snapshot = await account_ref.get();
  const account_data: Account | undefined = account_snapshot.data() as Account;
  switch (req.body.type) {
    case "customer.subscription.created": {
      console.log("Subscription Created");
      if (target_object.plan.product in functions.config().stripe.products) {
        try {
          console.log(target_object);
          batch.update(account_ref, {
            subscription_id: target_object.id,
            tier: 1,
            vaild_until: target_object.current_period_end,
            status: "",
          });
          await batch.commit();
        } catch (e) {
          console.error(e);
        }
      }
      break;
    }
    case "customer.subscription.deleted": {
      console.log("Subscription Deleted");
      if (target_object.subscription === account_data?.subscription_id) {
        batch.update(account_ref, {
          subscription_id: "",
          tier: 1,
          status: "UNSUBSCRIBED",
        });
        await batch.commit();
      }
      break;
    }
    case "customer.subscription.updated": {
      console.log("Subscription Updated");
      if (target_object.subscription === account_data?.subscription_id) {
        console.log(target_object);
        batch.update(account_ref, {
          subscription_id: "",
          tier: 1,
          status: "UNSUBSCRIBED",
        });
        await batch.commit();
      }
      break;
    }
    case "invoice.created": {
      console.log("Invoice Created");
      // await stripe.invoices.finalizeInvoice(target_object.id);
      // await stripe.invoices.pay(target_object.id);
      break;
    }
    case "invoice.finalized": {
      console.log("Invoice Created");
      await stripe.invoices.pay(target_object.id);
      break;
    }
    case "invoice.paid": {
      console.log("Invoice Paid");
      console.log(target_object);
      if (target_object.subscription === account_data?.subscription_id) {
        batch.update(account_ref, {
          status: "PAID",
        });
        await batch.commit();
      }
      break;
    }
    case "invoice.payment_failed": {
      console.log("Invoice Payment Failed");
      // Update account status to payment failed
      if (target_object.subscription === account_data?.subscription_id) {
        batch.update(account_ref, {
          status: "FAILED",
        });
        await batch.commit();
      }
      break;
    }
  }
  res.send("Hello from firebase");
};

export default handleWebhook;
