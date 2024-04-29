"use client";

import { doc, setDoc } from "firebase/firestore";
import Link from "next/link";
import { useState } from "react";
import { db } from "../firebase";
import useLogin from "../context/LoginProvider";

export default function SignUp() {
  const { name, setName, email, setEmail, role, setRole } = useLogin();

  const [formName, formSetName] = useState("");
  const [formEmail, formSetEmail] = useState("");
  const [formPassword, formSetPassword] = useState("");

  const signUp = async () => {
    await setDoc(doc(db, "users", formEmail), {
      name: formName,
      email: formEmail,
      password: formPassword,
      role: "user",
      reserved: [],
    });
    setName(formName);
    setEmail(formEmail);
    setRole("user");

    formSetName("");
    formSetEmail("");
    formSetPassword("");
  };
  return (
    <div className="w-full h-[60vh] flex flex-col items-center justify-center space-y-4">
      <label className="flex flex-col space-y-2 w-1/6">
        Jméno
        <input
          type="text"
          value={formName}
          onChange={(event) => {
            formSetName(event.target.value);
          }}
          className="rounded bg-slate-200 p-2"
        ></input>
      </label>
      <label className="flex flex-col space-y-2 w-1/6">
        Email
        <input
          type="text"
          value={formEmail}
          onChange={(event) => {
            formSetEmail(event.target.value);
          }}
          className="rounded bg-slate-200 p-2"
        ></input>
      </label>
      <label className="flex flex-col space-y-2 w-1/6">
        Heslo
        <input
          type="password"
          value={formPassword}
          onChange={(event) => {
            formSetPassword(event.target.value);
          }}
          className="rounded bg-slate-200 p-2"
        ></input>
      </label>
      <button onClick={signUp}>Registrovat</button>
      <Link href="/sign-in">Přihlášení</Link>
    </div>
  );
}
