import React, { useState, useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Button } from "../components";
import { StripeContext, IStripeContext } from "../contexts/StripeContext";
import {
  StripeSubscription,
  StripePrice,
  StripeCard,
  StripeInvoice,
} from "../stripe-components";
import { Product, Price, Wallet, Subscription } from "../types/stripe";

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
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [invoice, setInvoice] = useState<any>(null);

  useEffect(() => {
    get_subscription(id).then(({ data }: any) => {
      setSubscription(data);
      setInvoice(data.latest_invoice);
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
          <div>Current Payment Method</div>
          <div style={{ border: "1px solid black", borderRadius: 10 }}>
            <StripeSubscription
              subscription={subscription}
              orientation="column"
            />
          </div>
          <StripeCard
            readonly
            paymentMethod={subscription.default_payment_method}
          />
          <div>
            Other Payment Plans
            {products?.map((product: Product) => {
              if (product.id === subscription.plan.product.id) {
                return product.prices.map((priceItem: Price) => {
                  return (
                    <StripePrice
                      key={priceItem.id}
                      price={priceItem}
                      handleSubscribe={() => setSelectedPrice(priceItem)}
                      text={"Change Plan"}
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
          <div>
            Payment Methods
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
              Invoice
              <StripeInvoice invoice={invoice} />
            </div>
          )}
          <div>
            <Button
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
            </Button>
            <Button
              disabled={
                !(selectedPrice && subscription.plan.id !== selectedPrice.id)
              }
              onClick={() => handleChangePlan()}
            >
              Update Plan
            </Button>
            <Button onClick={() => cancel_subscription(id)}>Cancel</Button>
          </div>
        </div>
      )}
    </>
  );
};

export default SubscriptionPage;
