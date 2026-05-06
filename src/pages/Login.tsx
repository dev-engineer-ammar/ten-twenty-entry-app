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
    <div className="flex w-screen h-screen">
      <div className="w-[50vw]">
        <div className="flex items-center justify-center w-[50vw] ">
          <div className="w-[40vw] h-[28.14vh] absolute top-[31.88vh] flex flex-col justify-center items-center ">
            <form
              onSubmit={handleSubmit}
              className="w-full flex flex-col gap-y-[3.38vh]"
            >
              <div className="font-bold text-[1.38vw] ">Welcome back</div>
              <div className="space-y-[0.953vh] flex flex-col ">
                <Label
                  htmlFor="email"
                  className="font-medium text-[0.972vw] leading-[1.5] tracking-normal"
                >
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
              <div className="space-y-[0.953vh] flex flex-col">
                <Label
                  htmlFor="Password"
                  className="font-medium text-[0.972vw] leading-[1.5] tracking-normal"
                >
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
              <label className="flex items-center gap-2 text-[0.972vw] text-[#6B7280]">
                <Checkbox /> Remember me
              </label>
              <Button
                type="submit"
                className="w-full h-[5vh] rounded-[0.41vw] bg-[#1A56DB] text-[#FFFFFF] text-[0.729vw] hover:bg-[#1A56DB] active:bg-[#1A56DB] focus:bg-[#1A56DB] "
              >
              

  {isPending ? "loading..." : "Sign in"}
              </Button>
            </form>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center flex-col w-[50vw] bg-[#1C64F2]">
        <div className="flex  flex-col w-[40vw]">
          <h2 className="text-[2.77vw] m-[0vh] leading-[1.5] font-bold text-[#FFFFFF]">
            ticktock
          </h2>

          <p className="mt-[1.11vh]  text-[#FFFFFF] text-[1.11vw] leading-[1.5] ">
            Introducing ticktock, our cutting-edge timesheet web application
            designed to revolutionize how you manage employee work hours. With
            ticktock, you can effortlessly track and monitor employee attendance
            and productivity from anywhere, anytime, using any
            internet-connected device.
          </p>
        </div>
      </div>
    </div>
  );
};
