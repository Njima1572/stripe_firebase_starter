import React, { useState } from "react";
import {
  useStripe,
  useElements,
  CardNumberElement,
  CardCvcElement,
  CardExpiryElement,
} from "@stripe/react-stripe-js";
import { attach_payment_method } from "../lib/functions";

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: "#32325d",
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      padding: "12px 5px",
      fontSmoothing: "antialiased",
      fontSize: "14px",
      "::placeholder": {
        color: "#aab7c4",
      },
    },
    invalid: {
      color: "#fa755a",
      iconColor: "#fa755a",
    },
  },
};
const stripeElementWrapperStyle = {
  display: "block",
  borderRadius: 3,
  border: "1px solid #aab7c4",
  paddingTop: 12,
  paddingBottom: 12,
  paddingLeft: 5,
  paddingRight: 5,
};
const SetupPaymentPage = () => {
  const elements = useElements();
  const stripe = useStripe();
  const [cardError, setCardError] = useState<StripeError | null>(null);
  const [cardComplete, setCardComplete] = useState<boolean>(false);
  const [paymentInfo, setPaymentInfo] = useState<{ name: string }>({
    name: "",
  });

  const updatePaymenInfo = (target: string) => (value) => {
    setPaymentInfo({ ...paymentInfo, [target]: value });
  };
  const handleAddPaymentMethod = async () => {
    // Get Payment Method ID
    if (!cardComplete || cardError || !stripe || !elements) {
      return;
    }
    // Need error handling
    if (elements.getElement(CardNumberElement)) {
    }
    const { paymentMethod, error } = await stripe.createPaymentMethod({
      type: "card",
      card: elements.getElement(CardNumberElement),
      billing_details: {
        name: paymentInfo.name,
      },
    });
    if (error) {
      console.error(error);
      setCardError(error);
      return;
    }

    console.log(paymentMethod);
    if (!paymentMethod) {
      console.log(paymentMethod);
      return;
    }

    // Attach the payment method to the customer
    await attach_payment_method({
      payment_method_id: paymentMethod.id,
    });
    // Start Subscribe by calling functions
    console.log("Payment Method attached");
  };
  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <h1>クレジットカードの登録</h1>
        <label>"カード名義"</label>
        <input
          style={{ width: 288 }}
          value={paymentInfo.name}
          onChange={(e) => updatePaymenInfo("name")(e.target.value)}
        />
        <div style={{ width: "300px", marginBottom: 20 }}>
          <div style={stripeElementWrapperStyle}>
            <CardNumberElement
              options={CARD_ELEMENT_OPTIONS}
              onChange={(e) => {
                setCardError(e.error);
                setCardComplete(e.complete);
              }}
            />
          </div>
          <div style={stripeElementWrapperStyle}>
            <CardCvcElement
              options={CARD_ELEMENT_OPTIONS}
              onChange={(e) => {
                setCardError(e.error);
                setCardComplete(e.complete);
              }}
            />
          </div>
          <div style={stripeElementWrapperStyle}>
            <CardExpiryElement
              options={CARD_ELEMENT_OPTIONS}
              onChange={(e) => {
                setCardError(e.error);
                setCardComplete(e.complete);
              }}
            />
          </div>
        </div>
        <div style={{ display: "flex" }}>
          <div style={{ margin: 3 }}>
            <button onClick={() => handleAddPaymentMethod()}>
              カードを追加
            </button>
          </div>
        </div>
        <p style={{ fontSize: 10, color: "#a3a3a3" }}>
          *決済処理の反映までに数分かかる場合があります。
        </p>
      </div>
    </>
  );
};

export default SetupPaymentPage;
