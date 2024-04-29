"use client";

import { collection, doc, getDoc, getDocs, query, setDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "./firebase";
import useLogin from "./context/LoginProvider";
import { create } from "domain";

interface Plane {
  name: string;
  reservedBy: string;
  reserved: boolean;
}

export default function Home() {
  const { name, email, role } = useLogin();

  const [planes, setPlanes] = useState<Plane[]>([]);

  const [newPlane, setNewPlane] = useState("");

  const fetch = async () => {
    const q = query(collection(db, "planes"));

    let values: Plane[] = [];

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      values.push({
        name: data.name,
        reserved: data.reserved,
        reservedBy: data.reservedBy,
      });
    });

    setPlanes(values);
  };

  const removeReservation = async (email: string, planeName: string) => {
    const user = await getDoc(doc(db, "users", email));

    if (user.exists()) {
      const data = user.data();
      let reserved = data.reserved;

      reserved = reserved.filter((object: any) => {
        return object != planeName;
      });

      await setDoc(
        doc(db, "users", email),
        {
          reserved: reserved,
        },
        { merge: true }
      );

      await setDoc(
        doc(db, "planes", planeName),
        {
          reserved: false,
          reservedBy: "",
        },
        { merge: true }
      );

      fetch();
    }
  };

  const createNewPlane = async () => {
    await setDoc(doc(db, "planes", newPlane), {
      name: newPlane,
      reserved: false,
      reservedBy: "",
    });

    setNewPlane("");

    fetch();
  };

  const onReserve = async (plane: Plane) => {
    if (email == null || name == null || role == null) {
      return;
    }

    await setDoc(
      doc(db, "planes", plane.name),
      {
        reservedBy: email,
        reserved: true,
      },
      { merge: true }
    );

    const user = await getDoc(doc(db, "users", email));

    if (user.exists()) {
      const data = user.data();
      let reserved = data.reserved;

      reserved.push(plane.name);

      await setDoc(
        doc(db, "users", email),
        {
          reserved: reserved,
        },
        { merge: true }
      );

      fetch();
    }
  };

  useEffect(() => {
    fetch();
  }, []);

  return (
    <div className="w-full h-[60vh] flex flex-row justify-between">
      <div className="space-y-2 flex flex-col w-1/2">
        {planes.map((value) => {
          return (
            <div
              className={`flex flex-row ${value.reserved ? "bg-red-400" : "bg-slate-200"} p-2 rounded justify-between`}
              key={value.name}
            >
              <p>{value.name}</p>
              {value.reserved && <p>{value.reservedBy}</p>}
              {!value.reserved && role === "user" && (
                <button
                  onClick={() => {
                    onReserve(value);
                  }}
                >
                  reserve
                </button>
              )}
              {value.reserved && (role === "admin" || role === "super_admin") && (
                <button
                  onClick={() => {
                    removeReservation(value.reservedBy, value.name);
                  }}
                >
                  remove
                </button>
              )}
            </div>
          );
        })}
      </div>
      {(role === "admin" || role === "super_admin") && (
        <div className="w-1/4 flex flex-col items-center">
          <label className="flex flex-col space-y-2">
            Jméno
            <input
              type="text"
              value={newPlane}
              onChange={(event) => {
                setNewPlane(event.target.value);
              }}
              className="rounded bg-slate-200 p-2"
            ></input>
          </label>
          <button onClick={createNewPlane}>Vytvořit</button>
        </div>
      )}
    </div>
  );
}
