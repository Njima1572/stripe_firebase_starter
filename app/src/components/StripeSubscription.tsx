import React from "react";
import styled from "styled-components";
import { Price } from "./StripeItem";
import { cancel_subscription } from "../lib/functions";

const Wrapper = styled.div`
  width: 100%;
  height: 100px;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  border: 1px solid black;
`;

enum SubscriptionStatus {
  active = "active",
  incomplete = "incomplete",
  incomplete_expired = "incomplete_expired",
  trialing = "trialing",
  past_due = "past_due",
  canceled = "canceled",
  unpaid = "unpaid",
}

export interface Subscription {
  id: string;
  plan: Price;
  current_period_end: number;
  current_period_start: number;
  default_payment_method: string;
  latest_invoice: string;
  status: SubscriptionStatus;
}

const StripeSubscription = ({
  subscription,
}: {
  subscription: Subscription;
}) => {
  const handleCancelSubscription = () => {
    cancel_subscription(subscription.id);
  };
  return (
    <Wrapper>
      <div>{subscription.id}</div>
      <div>
        Your plan started at{" "}
        {new Date(subscription.current_period_start * 1000).toLocaleString()}
      </div>
      <div>
        Your Plan Renews at{" "}
        {new Date(subscription.current_period_end * 1000).toLocaleString()}
      </div>
      <div>{subscription.status}</div>
      <button onClick={() => handleCancelSubscription()}>Cancel</button>
    </Wrapper>
  );
};

export default StripeSubscription;
