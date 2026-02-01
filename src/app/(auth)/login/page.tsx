"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginAction } from "./action";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const { register, handleSubmit, formState } = form;

  async function onSubmit(data: LoginForm) {
    const res = await loginAction(data);
    if (res?.message) alert(res.message);
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-sm space-y-4"
      >
        <h1 className="text-xl font-semibold">Login</h1>

        <Input placeholder="Email" {...register("email")} />
        <Input
          type="password"
          placeholder="Password"
          {...register("password")}
        />

        <Button type="submit" disabled={formState.isSubmitting}>
          {formState.isSubmitting ? "Loading..." : "Login"}
        </Button>
      </form>
    </div>
  );
}
