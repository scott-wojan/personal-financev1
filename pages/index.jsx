import React from "react";
import axios from "axios";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();

  const login = async () => {
    const response = await axios.post("/api/login", { email: "test@test.com" });
    const { status, data: user } = response;
    if (user && status === 200) {
      router.push("/app");
      return;
    }
    if (!user) alert("User not found");
  };

  return (
    <>
      <div className="">Home</div>
      <button className="btn btn-primary" onClick={login}>
        Login
      </button>
    </>
  );
}
