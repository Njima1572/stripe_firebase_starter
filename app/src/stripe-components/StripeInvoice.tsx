import React from "react";
import { Wrapper, Button } from "../components";
import { useHistory } from "react-router-dom";
import { Subscription } from "../types/stripe";
import { cancel_subscription } from "../lib/functions";

export default ({ invoice }: { invoice: Invoice }) => {
  return (
    <Wrapper>
      <div>{invoice.id}</div>
      <div>{invoice.account_name}</div>
      <div>{invoice.amount_paid}</div>
      <div>{invoice.status}</div>
    </Wrapper>
  );
};
