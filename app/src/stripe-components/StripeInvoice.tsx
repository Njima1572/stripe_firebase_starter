import React from "react";
import { Wrapper, Button } from "../components";
import { Invoice } from "../types/stripe";
import { pay_invoice } from "../lib/functions";

export default ({ invoice }: { invoice: Invoice }) => {
  const handlePay = () => {
    pay_invoice(invoice.id).then((res) => console.log(res));
  };
  return (
    <Wrapper>
      <div>{invoice.id}</div>
      <div>{invoice.account_name}</div>
      <div>支払済: {invoice.amount_paid}</div>
      <div>合計: {invoice.total}</div>
      <div>{invoice.status}</div>
      {invoice.status === "open" && (
        <Button onClick={() => handlePay()}>Pay</Button>
      )}
    </Wrapper>
  );
};
