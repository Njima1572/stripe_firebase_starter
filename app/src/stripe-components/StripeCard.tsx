import React from "react";
import { Wrapper, Button } from "../components";
import { Wallet } from "../types/stripe";

export default ({
  paymentMethod,
  handleSelect,
  disabled,
  readonly,
  text = "Select",
}: {
  paymentMethod: Wallet;
  handleSelect?: (arg0: Wallet) => void;
  disabled?: boolean;
  readonly?: boolean;
  text?: string;
}) => {
  return (
    <Wrapper>
      <div>{paymentMethod.card.brand}</div>
      <div>{paymentMethod.card.last4}</div>
      <div>
        {paymentMethod.card.exp_month}/{paymentMethod.card.exp_year}
      </div>
      {!readonly && (
        <Button disabled={disabled} onClick={() => handleSelect(paymentMethod)}>
          {text}
        </Button>
      )}
    </Wrapper>
  );
};
