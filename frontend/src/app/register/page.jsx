"use client";
import Navbar from "../components/Navbar";
import Form from "../components/Forms";

function Register() {
  return (
    <div>
      <Navbar />
      <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
        <div className="w-full max-w-sm md:max-w-3xl">
          <Form route="/api/user/register/" method="register" />
        </div>
      </div>
    </div>
  );
}

export default Register;
