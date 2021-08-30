import React, { useEffect } from "react";
import { get_user_data } from "../lib/functions";

const HomePage = () => {
  useEffect(() => {
    const setupUserdata = async () => {
      let { data } = await get_user_data();
      console.table(data);
    };
    setupUserdata();
  }, []);

  return <div>Hello</div>;
};

export default HomePage;
