import React from "react";
import { Wrapper } from "./";
import { Price } from "../types/stripe";

const StripePrice = ({
  price,
  handleSubscribe,
  currentPrice,
}: {
  price: Price;
  handleSubscribe: () => void;
  currentPrice?: string;
}) => {
  return (
    <Wrapper>
      <div>
        <b>
          {price.currency.toUpperCase()}
          {price.unit_amount}
        </b>{" "}
        /{" "}
        {price.recurring.interval_count > 1
          ? price.recurring.interval_count
          : ""}
        {price.recurring.interval}
      </div>
      <button
        disabled={!!(currentPrice && currentPrice === price.id)}
        onClick={() => handleSubscribe()}
      >
        Subscribe
      </button>
    </Wrapper>
  );
};

export default StripePrice;
