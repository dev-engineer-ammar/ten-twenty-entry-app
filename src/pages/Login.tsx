import { useState } from "react";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Label } from "../components/ui/Label";
import { Checkbox } from "../components/ui/Checkbox";
import { useMutation } from "@tanstack/react-query";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import { setCookie } from "../services/cookie";

interface LoginPayloadType {
  email: string;
  password: string;
  token: string;
}
interface  InputProps {
  id: string;
}

export const Login = () => {
  // const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const { mutate, isPending }  = useMutation({
    mutationFn: (payload: LoginPayloadType) =>
      api.authPost("/auth/login", payload),

    onSuccess: (data) => {
      console.log("Login success:", data);
      setCookie("userdata", JSON.stringify(data));
      setCookie("accessToken", (data as LoginPayloadType)?.token as string);
      navigate("/timesheets");
    },

    onError: (error) => {
      console.log("Login failed:", error);
    },
  });

  const handleSubmit = (e) => {
    if(email === "" || password === "") return
    e.preventDefault();

    mutate({
      email: email,
      password: password,
    } as LoginPayloadType);
  };

  return (

   <div data-testid="login-page" className="min-h-screen grid lg:grid-cols-2">
      {/* Left: form */}
      <div className="flex items-center justify-center px-8 py-16 bg-white">
        <form
          data-testid="login-form"
          onSubmit={handleSubmit}
          className="w-full max-w-md space-y-7"
        >
          <h1 className="text-3xl font-bold text-slate-900">Welcome back</h1>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm text-slate-700">
              Email
            </Label>
            <Input
              id="email"
              data-testid="login-email-input"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-11"
              autoComplete="email"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm text-slate-700">
              Password
            </Label>
            <Input
              id="password"
              data-testid="login-password-input"
              type="password"
              placeholder="••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-11"
              autoComplete="current-password"
            />
          </div>

          <div className="flex items-center gap-2">
            <Checkbox
            />
            <Label htmlFor="remember" className="text-sm text-slate-600 cursor-pointer">
              Remember me
            </Label>
          </div>

          <Button
            type="submit"
            data-testid="login-submit-button"
            disabled={isPending}
            className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white text-base font-medium rounded-md"
          >
            {isPending ? "Signing in..." : "Sign in"}
          </Button>
        </form>
      </div>

      {/* Right: brand panel */}
      <div className="hidden lg:flex flex-col justify-center bg-blue-600 text-white px-16 py-16">
        <h2 className="text-6xl font-extrabold tracking-tight">ticktock</h2>
        <p className="mt-6 text-base leading-relaxed text-blue-50 max-w-lg">
          Introducing ticktock, our cutting-edge timesheet web application designed to
          revolutionize how you manage employee work hours. With ticktock, you can effortlessly
          track and monitor employee attendance and productivity from anywhere, anytime, using
          any internet-connected device.
        </p>
      </div>
    </div>
  );
};
