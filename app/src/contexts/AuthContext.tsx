import React, { createContext, useCallback, useState, useEffect } from "react";
import { auth } from "../FIREBASE_CONFIG";
import {
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

export interface IAuthContext {
  user: User | null;
  login:
    | (({
        email,
        password,
      }: {
        email: string;
        password: string;
      }) => Promise<any>)
    | (() => void);
  signup:
    | (({
        email,
        password,
      }: {
        email: string;
        password: string;
      }) => Promise<any>)
    | (() => void);
  signout: () => Promise<any> | void;
}
export const AuthContext = createContext<IAuthContext>({
  user: null,
  login: () => {},
  signout: () => {},
  signup: () => {},
});

export const AuthProvider = ({ children }: { children: React.FC }) => {
  const [user, setUser] = useState<User | null>(null);

  const onAuthStateChanged = useCallback((user: User | null) => {
    console.log("Changed Auth State");
    console.log(user);
    setUser(user);
  }, []);
  useEffect(() => {
    const subscriber = auth.onAuthStateChanged(onAuthStateChanged);
    return subscriber;
  }, [onAuthStateChanged]);
  const login = ({ email, password }: { email: string; password: string }) => {
    return signInWithEmailAndPassword(auth, email, password);
  };
  const signup = ({ email, password }: { email: string; password: string }) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };
  const signout = () => {
    return auth.signOut();
  };
  return (
    <AuthContext.Provider value={{ login: login, user, signup, signout }}>
      {children}
    </AuthContext.Provider>
  );
};
