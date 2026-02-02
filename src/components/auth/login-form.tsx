"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginAction } from "@/app/(auth)/login/action";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginForm = z.infer<typeof loginSchema>;

export function LoginForm() {
  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { register, handleSubmit, formState } = form;

  async function onSubmit(data: LoginForm) {
    const res = await loginAction(data);

    if (res?.message) {
      toast.error(res.message);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium">
          Email
        </label>
        <Input
          id="email"
          type="email"
          placeholder="you@example.com"
          {...register("email")}
          disabled={formState.isSubmitting}
        />
        {formState.errors.email && (
          <p className="text-sm text-red-600">
            {formState.errors.email.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="password" className="text-sm font-medium">
          Password
        </label>
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          {...register("password")}
          disabled={formState.isSubmitting}
        />
        {formState.errors.password && (
          <p className="text-sm text-red-600">
            {formState.errors.password.message}
          </p>
        )}
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={formState.isSubmitting}
      >
        {formState.isSubmitting ? "Logging in..." : "Login"}
      </Button>
    </form>
  );
}
