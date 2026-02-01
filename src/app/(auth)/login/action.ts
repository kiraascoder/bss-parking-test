"use server";

import { redirect } from "next/navigation";
import { createSupabaseServer } from "@/lib/supabase/server";

interface LoginPayload {
  email: string;
  password: string;
}

export async function loginAction(payload: LoginPayload) {
  const supabase = await createSupabaseServer();

  const { error } = await supabase.auth.signInWithPassword({
    email: payload.email,
    password: payload.password,
  });

  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }

  redirect("/dashboard");
}
