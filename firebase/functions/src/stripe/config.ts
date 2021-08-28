import Stripe from "stripe";

const stripe = new Stripe(functions.config().stripe.sk, {
  apiVersion: "2020-08-27",
});

export default stripe;
