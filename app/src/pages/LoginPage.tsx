import React, { useContext } from "react";
import { IAuthContext, AuthContext } from "../contexts/AuthContext";

const LoginPage = () => {
  const { login, signup, signout } = useContext<IAuthContext>(AuthContext);
  const handleSubmit = (e: React.SyntheticEvent, action: string) => {
    e.preventDefault();
    const target = e.target as typeof e.target & {
      email: { value: string };
      password: { value: string };
    };
    if (action === "signup") {
      signup({
        email: target.email.value,
        password: target.password.value,
      });
    } else if (action === "login") {
      login({ email: target.email.value, password: target.password.value });
    }
  };
  return (
    <div>
      <form onSubmit={(e) => handleSubmit(e, "signup")}>
        <input name="email" />
        <input name="password" type="password" />
        <button type="submit">Sign Up</button>
      </form>
      <form onSubmit={(e) => handleSubmit(e, "login")}>
        <input name="email" />
        <input name="password" type="password" />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default LoginPage;
