"use client";

import { PropsWithChildren, ReactNode, createContext, useContext, useState } from "react";
// define the props
type Role = "user" | "admin" | "super_admin" | null;
type Name = string | null;
type Email = string | null;

type LoginState = {
  name: Name;
  setName(name: Name): void;
  email: Email;
  setEmail(email: Email): void;
  role: Role;
  setRole(role: Role): void;
};

const LoginContext = createContext<LoginState | null>(null);

const useLogin = (): LoginState => {
  // 2. use the useContext hook
  const context = useContext(LoginContext);

  // 3. Make sure it's not null!
  if (!context) {
    throw new Error("Please use ThemeProvider in parent component");
  }

  return context;
};

type Props = {
  children: ReactNode;
};

export const LoginProvider = ({ children }: Props) => {
  const [role, setRole] = useState<Role>(null);
  const [name, setName] = useState<Name>(null);
  const [email, setEmail] = useState<Email>(null);

  return (
    <LoginContext.Provider value={{ name, setName, email, setEmail, role, setRole }}>{children}</LoginContext.Provider>
  );
};

export default useLogin;
