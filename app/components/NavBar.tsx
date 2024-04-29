"use client";

import Link from "next/link";
import useLogin from "../context/LoginProvider";

export default function Navbar() {
  const { name, setName, email, setEmail, setRole } = useLogin();
  return (
    <div>
      <nav className="f1 fixed z-50 flex h-16 w-full flex-row items-center justify-between bg-slate-500 px-5 font-medium text-black shadow-lg">
        <Link href="/">
          <p>Domů</p>
        </Link>
        <div className="flex flex-row space-x-8 items-center">
          {name === null && (
            <Link href="/sign-in">
              <p>Přihlášení</p>
            </Link>
          )}
          {name !== null && (
            <button
              onClick={() => {
                setName(null);
                setEmail(null);
                setRole(null);
              }}
            >
              Logout
            </button>
          )}
          <Link href="/user" className="flex flex-col items-center">
            <p>{name}</p>
            <p>{email}</p>
          </Link>
        </div>
      </nav>
      <div className="h-16"></div>
    </div>
  );
}
