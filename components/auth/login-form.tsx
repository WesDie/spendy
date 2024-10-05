"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { AlertCircle } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export function LoginForm({
  router,
}: {
  router: ReturnType<typeof useRouter>;
}) {
  const searchParams = useSearchParams();
  const regSuccess = searchParams.get("regsuccess");
  const confirm = searchParams.get("confirm");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState({ message: "", fields: [] as string[] });
  const [success, setSuccess] = useState("confirm" || "regsuccess" || "none");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    if (regSuccess) {
      setSuccess("regsuccess");
      router.replace("/login");

      setTimeout(() => {
        setSuccess("none");
      }, 8000);
    }
    if (confirm) {
      setSuccess("confirm");
      router.replace("/login");

      setTimeout(() => {
        setSuccess("none");
      }, 8000);
    }
  }, [regSuccess, router, confirm]);

  async function onSubmit() {
    setIsSubmitting(true);

    fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message === "Success") {
          router.push("/");
        } else {
          setError(data.error);
        }
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  }

  return (
    <div className="flex items-center justify-center min-h-screen w-full">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>
            Enter your credentials to access your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="grid w-full items-center gap-4">
              {error.message && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Sign in failed</AlertTitle>
                  <AlertDescription>{error.message}</AlertDescription>
                </Alert>
              )}
              {success === "confirm" ||
                (success === "regsuccess" && (
                  <Alert variant="success">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>
                      {success === "regsuccess"
                        ? "Registration successful"
                        : "Account verified successfully"}
                    </AlertTitle>
                    <AlertDescription>
                      {success === "regsuccess"
                        ? "Confirmation email sent, please check your email"
                        : "Account verified successfully, you can now log in"}
                    </AlertDescription>
                  </Alert>
                ))}
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  autoComplete="username"
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  error={error.fields.includes("email")}
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <Input
                  autoComplete="current-password"
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  error={error.fields.includes("password")}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="remember" />
                <Label htmlFor="remember">Remember me</Label>
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col gap-1 items-center space-y-2">
          <Button className="w-full" onClick={onSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Logging in..." : "Log in"}
          </Button>
          <CardDescription>
            Don&apos;t have an account?{" "}
            <Link className="underline" href="/register">
              Register
            </Link>
          </CardDescription>
        </CardFooter>
      </Card>
    </div>
  );
}
