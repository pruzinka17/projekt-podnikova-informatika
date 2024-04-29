"use client";

import { useEffect, useState } from "react";
import useLogin from "../context/LoginProvider";
import { collection, doc, getDoc, getDocs, query, setDoc } from "firebase/firestore";
import { db } from "../firebase";

interface User {
  email: string;
  name: string;
  role: string;
}

export default function User() {
  const { name, setName, email, setEmail, role } = useLogin();

  const [reserved, setReserved] = useState<string[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  const [formName, formSetName] = useState("");
  const [formEmail, formSetEmail] = useState("");
  const [formPassword, formSetPassword] = useState("");

  const fetch = async () => {
    if (email == null || name == null || role == null) {
      return;
    }

    const user = await getDoc(doc(db, "users", email));

    if (user.exists()) {
      const data = user.data();
      setReserved(data.reserved);
    }

    const q = query(collection(db, "users"));
    const snapshot = await getDocs(q);

    let users: User[] = [];

    snapshot.forEach((doc) => {
      const data = doc.data();

      const user: User = {
        email: data.email,
        name: data.name,
        role: data.role,
      };

      users.push(user);
    });

    setUsers(users);
  };

  const changeRole = async (email: string, newRole: string) => {
    await setDoc(
      doc(db, "users", email),
      {
        role: newRole,
      },
      { merge: true }
    );

    fetch();
  };

  const updateUser = async () => {
    if (email == null || name == null || role == null) {
      return;
    }

    setName(formName);
    setEmail(formEmail);

    await setDoc(
      doc(db, "users", email),
      {
        name: formName,
        email: formEmail,
        password: formPassword,
      },
      { merge: true }
    );

    formSetName("");
    formSetEmail("");
    formSetPassword("");
  };

  useEffect(() => {
    fetch();
  }, []);

  return (
    <div className="w-full flex flex-row justify-between">
      <div className="w-1/4 h-[60vh] flex flex-col">
        <p>{name}</p>
        <p>{email}</p>
        <p>{role}</p>
        {role === "user" && (
          <>
            <p className="pt-4 pb-2">Rezervace</p>
            <div className="flex flex-col space-y-4">
              {reserved.map((value) => {
                return (
                  <div className={`flex flex-row bg-slate-200 p-2 rounded justify-between w-full`} key={value}>
                    <p>{value}</p>
                  </div>
                );
              })}
            </div>
          </>
        )}
        {role === "super_admin" && (
          <div className="flex flex-col space-y-2 pt-4">
            {users.map((user) => {
              return (
                <div className="flex flex-row space-x-4 justify-between w-full">
                  <p>{user.name}</p>
                  <p>{user.email}</p>
                  <div className="flex flex-row space-x-4">
                    <button
                      className={`${user.role === "user" ? "bg-green-400" : "bg-transparent"}`}
                      onClick={() => {
                        changeRole(user.email, "user");
                      }}
                    >
                      user
                    </button>
                    <button
                      className={`${user.role === "admin" ? "bg-green-400" : "bg-transparent"}`}
                      onClick={() => {
                        changeRole(user.email, "admin");
                      }}
                    >
                      admin
                    </button>
                    <button
                      className={`${user.role === "super_admin" ? "bg-green-400" : "bg-transparent"}`}
                      onClick={() => {
                        changeRole(user.email, "super_admin");
                      }}
                    >
                      super_admin
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <div className="w-full h-[60vh] flex flex-col items-end justify-start space-y-4">
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
        <button onClick={updateUser}>Uložit</button>
      </div>
    </div>
  );
}
