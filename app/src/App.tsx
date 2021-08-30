import React from "react";
import { AuthProvider } from "./contexts/AuthContext";
import { StripeProvider } from "./contexts/StripeContext";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Navbar } from "./components";
import Home from "./pages/HomePage";
import Login from "./pages/LoginPage";
import Stripe from "./pages/StripePage";
import Payment from "./pages/SetupPaymentPage";
import "./App.css";

function App() {
  return (
    <div className="App">
      <Router>
        <AuthProvider>
          <StripeProvider>
            <>
              <Navbar />
              <Switch>
                <Route component={Home} path="/" exact />
                <Route component={Login} path="/login" exact />
                <Route component={Stripe} path="/stripe" exact />
                <Route component={Payment} path="/payment" exact />
              </Switch>
            </>
          </StripeProvider>
        </AuthProvider>
      </Router>
    </div>
  );
}

export default App;
