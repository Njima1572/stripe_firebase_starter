import React from "react";
import styled from "styled-components";

export interface Wallet {
  billing_details: {
    name: string;
  };
  card: {
    brand: string;
    country: string;
    exp_month: number;
    exp_year: number;
    last4: string;
  };
  id: string;
}
const Wrapper = styled.div`
  width: 100%;
  height: 100px;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  border: 1px solid black;
`;
const StripeCard = ({
  paymentMethod,
  handleSelect,
}: {
  paymentMethod: Wallet;
  handleSelect: (arg0: Wallet) => void;
}) => {
  return (
    <Wrapper>
      <div>{paymentMethod.card.brand}</div>
      <div>{paymentMethod.card.last4}</div>
      <div>
        {paymentMethod.card.exp_month}/{paymentMethod.card.exp_year}
      </div>
      <button onClick={() => handleSelect(paymentMethod)}>Select</button>
    </Wrapper>
  );
};

export default StripeCard;
