"use client";

import { doc, getDoc } from "firebase/firestore";
import Link from "next/link";
import { useState } from "react";
import { db } from "../firebase";
import Notiflix from "notiflix";
import useLogin from "../context/LoginProvider";

export default function SignIn() {
  const { name, setName, email, setEmail, role, setRole } = useLogin();

  const [formEmail, formSetEmail] = useState("");
  const [formPassword, formSetPassword] = useState("");

  const login = async () => {
    const docRef = doc(db, "users", formEmail);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();

      if (formPassword == data.password) {
        setName(data.name);
        setEmail(data.email);
        setRole(data.role);
        formSetEmail("");
        formSetPassword("");
      }
    } else {
      Notiflix.Notify.failure("chybne udaje");
    }
  };
  return (
    <div className="w-full h-[60vh] flex flex-col items-center justify-center space-y-4">
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
      <button onClick={login}>Přihlásit</button>
      <Link href="/sign-up">Registrace</Link>
    </div>
  );
}
