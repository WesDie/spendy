"use client";

import { Suspense } from "react";
import { useRouter } from "next/navigation";
import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  const router = useRouter();

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginForm router={router} />
    </Suspense>
  );
}
