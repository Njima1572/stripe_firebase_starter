import React, { useState, createContext, useEffect } from "react";
import { products, prices } from "../constants/stripe_items";
import { get_price, get_product } from "../lib/functions";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

// const stripePromise = loadStripe(import.meta.env.STRIPE_PK | "");
const stripePromise = loadStripe(
  "pk_test_51J6T0iGiq91P5YJOPcxM9SEiFhuYHJPvApALysLWOhpJiMDYeIvGmkIjYaghF5xq0VnW5g8zfSnfhlG9DsQLE68D00cccQD4kS"
);
export const StripeContext = createContext({});

export const StripeProvider = ({ children }) => {
  const [stripePrices, setStripePrices] = useState([]);
  const [stripeProducts, setStripeProducts] = useState([]);
  useEffect(() => {
    const setupItems = async () => {
      let pricePromises = prices.map(async (price) => {
        let { data } = await get_price(price);
        return data;
      });
      let productPromises = products.map(async (product) => {
        let { data } = await get_product(product);
        return data;
      });
      Promise.all(pricePromises).then((priceValues) => {
        setStripePrices(priceValues);
      });
      Promise.all(productPromises).then((productValues) => {
        setStripeProducts(productValues);
      });
    };
    setupItems();
  }, []);
  return (
    <Elements stripe={stripePromise}>
      <StripeContext.Provider
        value={{ stripePrices, stripeProducts, stripePromise }}
      >
        {children}
      </StripeContext.Provider>
    </Elements>
  );
};
