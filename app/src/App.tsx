import React from "react";
import { AuthProvider } from "./contexts/AuthContext";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Home from "./pages/HomePage";
import Login from "./pages/LoginPage";
import "./App.css";

function App() {
  return (
    <div className="App">
      <Router>
        <AuthProvider>
          <Switch>
            <Route component={Home} path="/" />
            <Route component={Login} path="/login" />
          </Switch>
        </AuthProvider>
      </Router>
    </div>
  );
}

export default App;
