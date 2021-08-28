import React, { createContext, useCallback, useState, useEffect } from "react";
import { auth } from "../FIREBASE_CONFIG.js";
import * as firebase from "firebase/app";

export const AuthContext = createContext();

export const AuthProvider = ({ children }: { children: React.FC }) => {
  const [user, setUser] = useState<firebase.User>({});

  const onAuthStateChanged = useCallback((user: firebase.User) => {
    console.log("Changed Auth State");
    console.log(user);
    setUser(user);
  }, []);
  useEffect(() => {
    const subscriber = auth.onAuthStateChanged(onAuthStateChanged);
    return subscriber;
  }, [onAuthStateChanged]);
  const login = ({ email, password }: { email: string; password: string }) => {
    auth.loginWithEmailAndPassword({ email, password });
  };
  return (
    <AuthContext.Provider values={{ login: login, user }}>
      {children}
    </AuthContext.Provider>
  );
};
