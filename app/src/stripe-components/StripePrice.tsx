import React from "react";
import { Wrapper, Button } from "../components";
import { Price } from "../types/stripe";

export default ({
  price,
  handleSubscribe,
  currentPrice,
  text = "Subscribe",
}: {
  price: Price;
  handleSubscribe: () => void;
  currentPrice?: string;
  text?: string;
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
      <Button
        disabled={!!(currentPrice && currentPrice === price.id)}
        onClick={() => handleSubscribe()}
      >
        {text}
      </Button>
    </Wrapper>
  );
};
