import * as React from "react";
import { useEffect, useState } from "react";
import { ACCESS_TOKEN } from "../constants";
import "../styles/navbar.css";
import Logout from "./Logout";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem(ACCESS_TOKEN);
      if (!token) {
        setIsLoggedIn(false);
      } else {
        setIsLoggedIn(true);
      }
    };

    checkAuth();
  }, []);

  return (
    <nav className="navbar">
      <ul className="navbar-list">
        <li className="navbar-item">
          <a href="/" className="navbar-link">
            Logo
          </a>
        </li>
        <li className="navbar-item">
          <a href="/home" className="navbar-link">
            Track
          </a>
        </li>
        <li className="navbar-item">
          <a href="/contact" className="navbar-link">
            Contact
          </a>
        </li>
        {pathname == "/login" || pathname == "/register" ? (
          ""
        ) : (
          <li className="navbar-item navbar-link">
            {!isLoggedIn ? <a href="/login">Login</a> : <Logout />}
          </li>
        )}
      </ul>
    </nav>
  );
}
