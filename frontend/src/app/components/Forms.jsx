"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent } from "@/app/components/ui/card";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { useState, useEffect } from "react";
import api from "../api/localapi";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import { useRouter, usePathname } from "next/navigation";

function Form({ route, method, className, ...props }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);
  const [fade, setFade] = useState("opacity-100");
  const router = useRouter();
  const pathname = usePathname();
  const name = method === "login" ? "Login" : "Register";
  const images = [
    "/img/picture1.jpg",
    "/img/picture2.png",
    "/img/picture3.jpeg",
    "/img/picture4.jpg",
    "/img/picture5.jpg",
    "/img/picture6.jpg",
    "/img/picture7.jpg",
    "/img/picture8.jpg",
  ];
  useEffect(() => {
    const interval = setInterval(() => {
      setFade("opacity-0");

      setTimeout(() => {
        setCurrentImage((prevIndex) => (prevIndex + 1) % images.length);
        setFade("opacity-100");
      }, 1000);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  let formname = "";
  let forgot = "";
  let logreg = "";
  let welcome = "";
  let hideSignUp = false;

  if (pathname == "/login") {
    formname = "Login to your FTrack account";
    forgot = "Forgot your password?";
    logreg = "Login";
    welcome = "Welcome back";
  } else {
    formname = "Register your FTrack account";
    forgot = "";
    logreg = "Register";
    hideSignUp = true;
    welcome = "Welcome Guests";
  }

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();

    try {
      const res = await api.post(route, { username, password, email });
      if (method === "login") {
        localStorage.setItem(ACCESS_TOKEN, res.data.access);
        localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
        router.push("/");
      } else {
        router.push("/login");
      }
    } catch (error) {
      alert(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-8 md:p-10" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-8">
              {" "}
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">{welcome}</h1>
                <p className="text-balance text-muted-foreground">{formname}</p>
              </div>
            </div>
            <div className="mt-8">
              {" "}
              <div className="grid gap-4">
                {" "}
                {/* Username */}
                <div className="flex flex-col gap-1">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    className="form-input"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Username"
                    required
                  />
                </div>
                {/* Password */}
                <div className="flex flex-col gap-1">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    className="form-input"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    required
                  />
                </div>
                {hideSignUp && (
                  <div className="flex flex-col gap-1">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      className="form-input"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Email"
                      required
                    />
                  </div>
                )}
                {/* Forgot Password */}
                <div className="flex items-center">
                  <a
                    href="#"
                    className="ml-auto text-sm underline-offset-2 hover:underline"
                  >
                    {forgot}
                  </a>
                </div>
              </div>
              {/* Login Button */}
              <div className="mt-6">
                {" "}
                <Button type="submit" className="w-full">
                  {logreg}
                </Button>
              </div>
              {/* Don't have an account? */}
              {!hideSignUp && (
                <div className="text-center text-sm mt-6">
                  {" "}
                  Don&apos;t have an account?{" "}
                  <a href="/register/" className="underline underline-offset-4">
                    Sign up
                  </a>
                </div>
              )}
            </div>
          </form>

          {/* Background Image Section */}
          <div className="relative hidden bg-muted md:block">
            <div
              className={`absolute inset-0 transition-opacity duration-1000 ${fade}`}
            >
              <img
                src={images[currentImage]}
                alt="Image"
                className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default Form;
