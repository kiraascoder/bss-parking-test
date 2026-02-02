"use server";

import { createSupabaseServer } from "@/lib/supabase/server";

interface RegisterPayload {
  email: string;
  password: string;
}

export async function registerAction(payload: RegisterPayload) {
  const supabase = await createSupabaseServer();

  const { error } = await supabase.auth.signUp({
    email: payload.email,
    password: payload.password,
  });

  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }

  return {
    success: true,
    message: "Registration successful! Please check your email.",
  };
}
