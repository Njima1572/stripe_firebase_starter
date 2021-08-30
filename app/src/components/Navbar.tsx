import React from "react";
import "./Navbar.scss";
import { Link } from "react-router-dom";

const Navbar = () => (
  <div className="navbar">
    <ul>
      <li>
        <Link to="/">Home</Link>
      </li>
      <li>
        <Link to="/login">Login</Link>
      </li>
      <li>
        <Link to="/stripe">Stripe</Link>
      </li>
      <li>
        <Link to="/payment">Payment</Link>
      </li>
    </ul>
  </div>
);

export default Navbar;
