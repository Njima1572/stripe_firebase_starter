import React from "react";
import { Wrapper } from "../components";
import { Wallet } from "../types/stripe";

export default ({
  paymentMethod,
  handleSelect,
  currentPaymentMethod = "",
}: {
  paymentMethod: Wallet;
  handleSelect: (arg0: Wallet) => void;
  currentPaymentMethod?: string;
}) => {
  return (
    <Wrapper>
      <div>{paymentMethod.card.brand}</div>
      <div>{paymentMethod.card.last4}</div>
      <div>
        {paymentMethod.card.exp_month}/{paymentMethod.card.exp_year}
      </div>
      <button
        disabled={currentPaymentMethod === paymentMethod.id}
        onClick={() => handleSelect(paymentMethod)}
      >
        Select
      </button>
    </Wrapper>
  );
};
