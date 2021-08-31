import React, { useState, useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { StripeContext, IStripeContext } from "../contexts/StripeContext";
import { StripePrice, StripeCard, StripeInvoice } from "../stripe-components";
import { Product, Price, Wallet, SubscriptionDetail } from "../types/stripe";

import {
  get_subscription,
  list_payment_methods,
  cancel_subscription,
  update_subscription_payment_source,
  change_subscription_plan,
} from "../lib/functions";
const SubscriptionPage = () => {
  const { id } = useParams<{ id: string }>();
  const { products } = useContext<IStripeContext>(StripeContext);
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<Wallet | null>(null);

  const [selectedPrice, setSelectedPrice] = useState<Price | null>(null);
  const [paymentMethods, setPaymentMethods] = useState<Wallet[]>([]);
  const [subscription, setSubscription] = useState<SubscriptionDetail | null>(
    null
  );
  const [invoice, setInvoice] = useState<any>(null);

  useEffect(() => {
    get_subscription(id).then(({ data }: any) => {
      setSubscription(data);
      setInvoice(data.latest_invoice);
      console.log(data.default_payment_method);
    });
    list_payment_methods().then(({ data }: { data: Wallet[] }) => {
      setPaymentMethods(data);
    });
  }, []);

  const handleUpdatePaymentSource = () => {
    if (selectedPaymentMethod) {
      update_subscription_payment_source({
        subscription_id: id,
        payment_method_id: selectedPaymentMethod.id,
      });
    }
  };

  const handleChangePlan = () => {
    if (selectedPrice && subscription) {
      change_subscription_plan({
        subscription_id: id,
        new_price_id: selectedPrice.id,
      }).then((res) => {
        console.log(res);
      });
    }
  };

  return (
    <>
      <div>Subscription {id}</div>
      {subscription && (
        <div>
          <div>{subscription.id}</div>
          <StripeCard
            readonly
            paymentMethod={subscription.default_payment_method}
          />
          {
            <div>
              {products?.map((product: Product) => {
                if (product.id === subscription.plan.product) {
                  return product.prices.map((priceItem: Price) => {
                    return (
                      <StripePrice
                        key={priceItem.id}
                        price={priceItem}
                        handleSubscribe={() => setSelectedPrice(priceItem)}
                        currentPrice={
                          selectedPrice
                            ? selectedPrice.id
                            : subscription.items.data[0].price.id
                        }
                      />
                    );
                  });
                }
              })}
            </div>
          }
          <div>
            {paymentMethods.map((paymentMethod) => {
              return (
                <StripeCard
                  key={paymentMethod.id}
                  disabled={
                    paymentMethod.id ===
                    (selectedPaymentMethod
                      ? selectedPaymentMethod?.id
                      : subscription.default_payment_method.id)
                  }
                  paymentMethod={paymentMethod}
                  handleSelect={setSelectedPaymentMethod}
                />
              );
            })}
          </div>
          {invoice && (
            <div>
              <StripeInvoice invoice={invoice} />
            </div>
          )}
          <div>
            <button
              disabled={
                !(
                  selectedPaymentMethod &&
                  subscription.default_payment_method.id !==
                    selectedPaymentMethod.id
                )
              }
              onClick={() => handleUpdatePaymentSource()}
            >
              Update Payment Method
            </button>
            <button
              disabled={
                !(
                  selectedPrice &&
                  subscription.items.data[0].price.id !== selectedPrice.id
                )
              }
              onClick={() => handleChangePlan()}
            >
              Update Plan
            </button>
            <button onClick={() => cancel_subscription(id)}>Cancel</button>
          </div>
        </div>
      )}
    </>
  );
};

export default SubscriptionPage;
