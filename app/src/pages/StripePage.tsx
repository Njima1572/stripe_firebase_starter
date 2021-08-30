import React, { useState, useContext, useEffect } from "react";
import { StripeContext } from "../contexts/StripeContext";
import StripePrice, { Product, Price } from "../components/StripeItem";
import StripeSubscription, {
  Subscription,
} from "../components/StripeSubscription";
import StripeCard, { Wallet } from "../components/StripeCard";
import {
  list_payment_methods,
  start_subscription,
  list_subscriptions,
  create_billing_portal,
} from "../lib/functions.ts";

const StripePage = () => {
  const { stripeProducts, stripePrices } = useContext<{
    stripePrices: Price[];
    stripeProducts: Product[];
  }>(StripeContext);

  const [paymentMethods, setPaymentMethods] = useState<Wallet[]>([]);
  const [
    selectedPaymentMethod,
    setSelectedPaymentMethod,
  ] = useState<Wallet | null>(null);

  const [currentSubscriptions, setCurrentSubscriptions] = useState<
    Subscription[]
  >([]);

  const [group, setGroup] = useState<any>({});

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
    list_subscriptions().then(
      ({ data }: { data: { data: Subscription[] } }) => {
        setCurrentSubscriptions(data.data);
      }
    );
    list_payment_methods().then(({ data }: { data: { data: Wallet[] } }) => {
      setPaymentMethods(data.data);
    });
    let tmp: any = {};
    stripePrices.forEach((priceItem: Price) => {
      if (priceItem.product in tmp) {
        tmp[priceItem.product] = [...tmp[priceItem.product], priceItem];
      } else {
        tmp[priceItem.product] = [priceItem];
      }
    });
    setGroup(tmp);
  }, [stripeProducts, stripePrices]);

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
      {stripeProducts.map((product) => {
        return (
          <div>
            <div>{product.name}</div>
            {group[product.id].map((price: Price) => {
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
