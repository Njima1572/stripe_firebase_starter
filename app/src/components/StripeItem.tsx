import React from "react";
import styled from "styled-components";
const Wrapper = styled.div`
  width: 100%;
  height: 100px;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  border: 1px solid black;
`;

export interface Product {
  id: string;
  name: string;
}

export interface Price {
  id: string;
  product: string;
  currency: string;
  unit_amount: number;
  recurring: {
    interval: "month" | "year";
    interval_count: number;
  };
}

const StripePrice = ({
  price,
  handleSubscribe,
}: {
  price: {
    id: string;
    currency: string;
    unit_amount: number;
    recurring: { interval_count: number; interval: string };
  };
  handleSubscribe: () => void;
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
      <button onClick={() => handleSubscribe()}>Subscribe</button>
    </Wrapper>
  );
};

export default StripePrice;
