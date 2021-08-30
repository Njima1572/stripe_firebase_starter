import React, { useState, useContext, useEffect } from "react";
import { StripeContext } from "../contexts/StripeContext";
interface Product {
  id: string;
}
interface Price {
  id: string;
  product: string;
  currency: string;
  unit_amount: number;
  recurring: {
    interval: "month" | "year";
    interval_count: number;
  };
}

const StripePage = () => {
  const { stripeProducts, stripePrices } = useContext<{
    stripePrices: Price[];
    stripeProducts: Product[];
  }>(StripeContext);

  const [group, setGroup] = useState<any>({});

  useEffect(() => {
    let tmp: any = {};
    stripePrices.forEach((priceItem: Price) => {
      console.table(priceItem, ["Value"]);
      if (priceItem.product in tmp) {
        tmp[priceItem.product] = [...tmp[priceItem.product], priceItem];
      } else {
        tmp[priceItem.product] = [priceItem];
      }
    });
    setGroup(tmp);
  }, [stripeProducts, stripePrices]);

  return (
    <>
      {Object.keys(group).map((product) => {
        return (
          <div>
            <div>{product}</div>
            {group[product].map((price: Price) => {
              return (
                <div>
                  {price.currency}
                  {price.unit_amount} per{" "}
                  {price.recurring.interval_count > 1
                    ? price.recurring.interval_count
                    : ""}
                  {price.recurring.interval}
                </div>
              );
            })}
          </div>
        );
      })}
    </>
  );
};

export default StripePage;
