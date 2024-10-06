"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState({ message: "", fields: [] as string[] });

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
  });

  async function onSubmit() {
    setIsSubmitting(true);

    fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message === "Success") {
          router.push("/login?regsuccess=true");
        } else {
          console.log(data.error);
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
          <CardTitle>Register</CardTitle>
          <CardDescription>
            Enter your credentials to create an account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="grid w-full items-center gap-4">
              {error.message && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Registration failed</AlertTitle>
                  <AlertDescription>{error.message}</AlertDescription>
                </Alert>
              )}
              <div className="flex flex-col space-y-1.5">
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="first-name">First name</Label>
                    <Input
                      id="first-name"
                      placeholder="John"
                      required
                      onChange={(e) =>
                        setFormData({ ...formData, firstName: e.target.value })
                      }
                      error={error.fields.includes("firstName")}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="last-name">Last name</Label>
                    <Input
                      id="last-name"
                      placeholder="Doe"
                      required
                      onChange={(e) =>
                        setFormData({ ...formData, lastName: e.target.value })
                      }
                      error={error.fields.includes("lastName")}
                    />
                  </div>
                </div>
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  autoComplete="username"
                  id="email"
                  type="email"
                  placeholder="Enter your password"
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
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col gap-1 items-center space-y-2">
          <Button className="w-full" onClick={onSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Registering..." : "Register"}
          </Button>
          <CardDescription>
            Already have an account?{" "}
            <Link className="underline" href="/login">
              Login
            </Link>
          </CardDescription>
        </CardFooter>
      </Card>
    </div>
  );
}
