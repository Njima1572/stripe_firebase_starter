import React from "react";
import { Wrapper } from "../components";
import { useHistory } from "react-router-dom";
import { Subscription } from "../types/stripe";
import { cancel_subscription } from "../lib/functions";

export default ({
  subscription,
}: {
  subscription: Subscription;
}) => {
  const history = useHistory();
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
      <button onClick={() => history.push(`/subscriptions/${subscription.id}`)}>
        Detail
      </button>
      <button onClick={() => handleCancelSubscription()}>Cancel</button>
    </Wrapper>
  );
};
