import { createSupabaseServer } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { RegisterForm } from "@/components/auth/register-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default async function RegisterPage() {
  const supabase = await createSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 px-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-semibold text-center">
            Register
          </CardTitle>
          <p className="text-sm text-muted-foreground text-center">
            Create a new account
          </p>
        </CardHeader>

        <CardContent className="space-y-4">
          <RegisterForm />          
          <p className="text-sm text-center text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-primary hover:underline"
            >
              Login
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
