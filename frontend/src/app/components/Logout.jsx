"use client";

import { useRouter } from "next/navigation";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";

export default function Logout() {
  const router = useRouter();
  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.removeItem(ACCESS_TOKEN);
    localStorage.removeItem(REFRESH_TOKEN);
    window.location.reload();
  };
  return (
    <div>
      <button onClick={handleSubmit}>Logout</button>
    </div>
  );
}
