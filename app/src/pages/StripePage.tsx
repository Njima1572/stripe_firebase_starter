import React, { useState, useContext, useEffect } from "react";
import { StripeContext, IStripeContext } from "../contexts/StripeContext";
import {
  StripePrice,
  StripeSubscription,
  StripeCard,
} from "../stripe-components";
import { Wallet, Product, Price, Subscription } from "../types/stripe";
import {
  list_payment_methods,
  start_subscription,
  list_subscriptions,
  create_billing_portal,
} from "../lib/functions";

const StripePage = () => {
  const { products } = useContext<IStripeContext>(StripeContext);
  const [paymentMethods, setPaymentMethods] = useState<Wallet[]>([]);
  const [
    selectedPaymentMethod,
    setSelectedPaymentMethod,
  ] = useState<Wallet | null>(null);

  const [currentSubscriptions, setCurrentSubscriptions] = useState<
    Subscription[]
  >([]);

  const handleSubscribe = (price_id: string) => async () => {
    if (selectedPaymentMethod) {
      let { data } = await start_subscription({
        price_id: price_id,
        payment_method_id: selectedPaymentMethod.id,
      });
      console.table(data, ["Value"]);
    }
  };
  useEffect(() => {
    list_subscriptions().then(({ data }: { data: Subscription[] }) => {
      setCurrentSubscriptions(data);
      console.table(products, ["Values"]);
    });
    list_payment_methods().then(({ data }: { data: Wallet[] }) => {
      setPaymentMethods(data);
    });
  }, []);

  return (
    <>
      {paymentMethods.map((paymentMethod) => {
        return (
          <StripeCard
            paymentMethod={paymentMethod}
            handleSelect={setSelectedPaymentMethod}
          />
        );
      })}
      <div>{selectedPaymentMethod?.id}</div>
      {products &&
        products.map((product: Product) => {
          console.table(product);
          return (
            <div>
              <div>{product.id}</div>
              {products &&
                product?.prices.map((price: Price) => {
                  return (
                    <StripePrice
                      price={price}
                      handleSubscribe={handleSubscribe(price.id)}
                    />
                  );
                })}
            </div>
          );
        })}
      {currentSubscriptions.map((subscription) => {
        return <StripeSubscription subscription={subscription} />;
      })}
      <button
        onClick={() =>
          create_billing_portal().then(({ data }) => {
            window.location.assign(data.url);
          })
        }
      >
        Create Billing Portal
      </button>
    </>
  );
};

export default StripePage;
