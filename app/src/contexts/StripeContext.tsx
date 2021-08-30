import React, { useState, createContext, useEffect } from "react";
import { productIds } from "../constants/stripe_items";
import { get_product } from "../lib/functions";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { Product } from "../components/StripeItem";

const stripePromise = loadStripe(import.meta.env.STRIPE_PK | "");

export interface IStripeContext {
  stripePromise: Promise<any>;
  products: Product[];
}
export const StripeContext = createContext<IStripeContext>({
  stripePromise: new Promise(() => {}),
  products: [],
});

export const StripeProvider = ({ children }: { children: React.FC }) => {
  const [products, setProducts] = useState<Product[] | null>(null);
  useEffect(() => {
    const setupItems = async () => {
      let productPromises = productIds.map(async (product: string) => {
        let productItem: { data: Product } = (await get_product(product)) as {
          data: Product;
        };
        return productItem.data;
      });
      Promise.all(productPromises).then((productValues: Product[]) => {
        setProducts(productValues);
      });
    };
    setupItems();
  }, []);
  return (
    <Elements stripe={stripePromise}>
      <StripeContext.Provider value={{ stripePromise, products }}>
        {children}
      </StripeContext.Provider>
    </Elements>
  );
};
