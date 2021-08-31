import React from "react";
import { Wrapper, Button } from "../components";
import { useHistory } from "react-router-dom";
import { Subscription, SubscriptionStatus } from "../types/stripe";
import { cancel_subscription } from "../lib/functions";

const Status = ({ status }: { status: SubscriptionStatus }) => {
  const colors: any = {
    active: "green",
    incomplete: "red",
    incomplete_expired: "red",
    trialing: "blue",
    past_due: "red",
    canceled: "red",
    unpaid: "red",
  };
  return <div style={{ color: colors[status] }}>{status}</div>;
};

export default ({
  subscription,
  orientation = "row",
  preview = false,
}: {
  subscription: Subscription;
  orientation?: string;
  preview?: boolean;
}) => {
  const history = useHistory();
  const handleCancelSubscription = () => {
    cancel_subscription(subscription.id);
  };

  console.log(subscription);
  return (
    <Wrapper orientation={orientation}>
      {!preview && (
        <div>
          {typeof subscription.plan.product !== "string"
            ? subscription.plan.product?.name
            : subscription.id}
        </div>
      )}
      <div>
        <b>
          {subscription.plan.currency.toUpperCase()}
          {subscription.plan.amount}
        </b>{" "}
        /{" "}
        {subscription.plan.interval_count > 1
          ? subscription.plan.interval_count
          : ""}
        {subscription.plan.interval}
      </div>
      <div>
        <div>
          開始日時{" "}
          {new Date(subscription.current_period_start * 1000).toLocaleString()}
        </div>
        <div>
          更新日時{" "}
          {new Date(subscription.current_period_end * 1000).toLocaleString()}
        </div>
      </div>

      <Status status={subscription.status} />
      {preview && (
        <>
          <Button
            onClick={() => history.push(`/subscriptions/${subscription.id}`)}
          >
            Detail
          </Button>
          <Button
            backgroundColor="red"
            onClick={() => handleCancelSubscription()}
          >
            Cancel
          </Button>
        </>
      )}
    </Wrapper>
  );
};
