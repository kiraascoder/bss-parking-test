import { redirect } from "next/navigation";
import { createSupabaseServer } from "@/lib/supabase/server";
import { logoutAction } from "./action";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function DashboardPage() {
  const supabase = await createSupabaseServer();
  const { data } = await supabase.auth.getUser();

  if (!data.user) redirect("/login");

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-xl">Dashboard</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">Welcome,</p>
          <p className="font-medium">{data.user.email}</p>

          <div className="flex items-center gap-2 pt-2">
            <Button asChild variant="outline">
              <Link href="/products">Products</Link>
            </Button>

            <form action={logoutAction}>
              <Button type="submit" variant="destructive">
                Logout
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
