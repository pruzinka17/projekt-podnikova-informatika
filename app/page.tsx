"use client";

import useLogin from "./context/LoginProvider";

export default function Home() {
  const { name, setName, email, setEmail, role, setRole } = useLogin();
  return <div> {name} </div>;
}
