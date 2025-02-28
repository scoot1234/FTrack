"use client";
import Navbar from "../components/Navbar";
import "../styles/contact.css";

export default function Contact() {
  return (
    <div>
      <Navbar />
      <div className="contact">
        <h1 className="header">Contact us using the following platforms!</h1>
        <div className="contact-info">
          <h2>Email us on:</h2>
          <p>XXX@gmail.com</p>
          <h2>Whatsapp us on:</h2>
          <p> +123 456 7890</p>
          <h2>Social Media:</h2>
          <p>
            Twitter:{" "}
            <a
              href="https://twitter.com/yourhandle"
              target="_blank"
              rel="noopener noreferrer"
            >
              @Ftrack
            </a>
          </p>
          <p>
            Instagram:{" "}
            <a
              href="https://twitter.com/yourhandle"
              target="_blank"
              rel="noopener noreferrer"
            >
              @Ftrack
            </a>
          </p>
          <p>
            Facebook:{" "}
            <a
              href="https://twitter.com/yourhandle"
              target="_blank"
              rel="noopener noreferrer"
            >
              @Ftrack
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
