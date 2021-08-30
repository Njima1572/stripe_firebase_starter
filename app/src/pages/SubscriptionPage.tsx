import React, { useState, useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { StripeContext } from "../contexts/StripeContext";
import { StripePrice, StripeCard } from "../stripe-components";
import { Product, Price, Wallet } from "../types/stripe";

import {
  get_subscription,
  get_invoice,
  list_payment_methods,
  cancel_subscription,
  update_subscription_payment_source,
  change_subscription_plan,
} from "../lib/functions";

interface SubscriptionDetail {
  id: string;
  default_payment_method: string;
  latest_invoice: string;
  collection_method: string;
  status: string;
  days_until_due: string;
  canceled_at: number;
  items: {
    data: { plan: { id: string }; price: { id: string; product: string } }[];
  };
}

interface Invoice {
  id: string;
  account_name: string;
  amount_paid: string;
  amount_due: string;
  invoice_pdf_url: string;
  total: number;
  status: string;
}

const Invoice = ({ invoice }: { invoice: Invoice }) => {
  return (
    <div>
      <div>{invoice.id}</div>
      <div>{invoice.account_name}</div>
      <div>{invoice.amount_paid}</div>
      <div>{invoice.status}</div>
    </div>
  );
};

const SubscriptionPage = () => {
  const { id } = useParams();
  const { stripePrices } = useContext<{
    stripePrices: Price[];
    stripeProducts: Product[];
  }>(StripeContext);
  const [
    selectedPaymentMethod,
    setSelectedPaymentMethod,
  ] = useState<Wallet | null>(null);

  const [selectedPrice, setSelectedPrice] = useState<Price | null>(null);
  const [paymentMethods, setPaymentMethods] = useState<Wallet[]>([]);
  const [subscription, setSubscription] = useState<SubscriptionDetail | null>(
    null
  );
  const [invoice, setInvoice] = useState<any>(null);

  useEffect(() => {
    get_subscription(id).then(({ data }: any) => {
      setSubscription(data);
      get_invoice(data.latest_invoice).then(({ data }) => {
        setInvoice(data);
      });
    });
    list_payment_methods().then(({ data }: { data: { data: Wallet[] } }) => {
      setPaymentMethods(data.data);
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
    if (selectedPrice) {
      change_subscription_plan({
        subscription_id: id,
        new_price_ids: [selectedPrice.id],
      });
    }
  };

  return (
    <>
      <div>Subscription {id}</div>
      {subscription && (
        <div>
          <div>{subscription.id}</div>
          <div>{subscription.default_payment_method}</div>
          {
            <div>
              {stripePrices.map((priceItem: Price) => {
                console.log(subscription.items.data[0].price);
                if (
                  priceItem.product === subscription.items.data[0].price.product
                )
                  return (
                    <StripePrice
                      price={priceItem}
                      handleSubscribe={() => setSelectedPrice(priceItem)}
                      currentPrice={
                        selectedPrice
                          ? selectedPrice.id
                          : subscription.items.data[0].price.id
                      }
                    />
                  );
              })}
            </div>
          }
          <div>
            {paymentMethods.map((paymentMethod) => {
              return (
                <StripeCard
                  currentPaymentMethod={
                    selectedPaymentMethod
                      ? selectedPaymentMethod?.id
                      : subscription.default_payment_method
                  }
                  paymentMethod={paymentMethod}
                  handleSelect={setSelectedPaymentMethod}
                />
              );
            })}
          </div>
          {invoice && (
            <div>
              <Invoice invoice={invoice} />
            </div>
          )}
          <div>
            <button
              disabled={
                !(
                  selectedPaymentMethod &&
                  subscription.default_payment_method !==
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
