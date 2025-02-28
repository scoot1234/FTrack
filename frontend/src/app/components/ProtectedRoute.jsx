"use client";

import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import api from "../api/localapi";
import { REFRESH_TOKEN, ACCESS_TOKEN } from "../constants";
import { useState, useEffect } from "react";

function ProtectedRoute({ children }) {
  const [isAuthorized, setIsAuthorized] = useState(null);
  const router = useRouter();
  api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response && error.response.status === 401) {
        console.log("Unauthorized request. Silencing error...");
        return Promise.resolve({ data: [] }); // Return empty data to prevent breaking
      }
      return Promise.reject(error);
    }
  );
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem(ACCESS_TOKEN);

      if (!token) {
        setIsAuthorized(false);
        alert("Unauthorized access! Please login.");
        return;
      }

      try {
        const decoded = jwtDecode(token);
        const tokenExpiration = decoded.exp;
        const now = Date.now() / 1000;

        if (tokenExpiration < now) {
          await refreshToken();
        } else {
          setIsAuthorized(true);
        }
      } catch (error) {
        console.error("Error decoding token:", error);
        setIsAuthorized(false);
      }
    };

    checkAuth();
  }, []);

  const refreshToken = async () => {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN);
    try {
      const res = await api.post("/api/token/refresh/", {
        refresh: refreshToken,
      });
      if (res.status === 200) {
        localStorage.setItem(ACCESS_TOKEN, res.data.access);
        setIsAuthorized(true);
      } else {
        setIsAuthorized(false);
      }
    } catch (error) {
      console.log(error);
      setIsAuthorized(false);
    }
  };

  useEffect(() => {
    if (isAuthorized === false) {
      router.push("/login"); // Redirect to login page if not authorized
    }
  }, [isAuthorized, router]);

  if (isAuthorized === null) {
    return <div>Loading...</div>;
  }

  return isAuthorized ? children : null;
}

export default ProtectedRoute;
