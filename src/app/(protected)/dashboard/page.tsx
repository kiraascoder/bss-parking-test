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

  const displayName = data.user.user_metadata?.display_name || "User";

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <Card className="md:col-span-2 lg:col-span-1">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-semibold">
            Welcome back, {displayName}
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Manage your account and view products
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Account Information
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 rounded-lg border bg-muted/30 px-3 py-2.5">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <div className="flex flex-col">
                  <p className="font-medium text-sm">{displayName}</p>
                  <p className="text-xs text-muted-foreground">
                    {data.user.email}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2 pt-2">
            <Button asChild size="default" className="w-full">
              <Link href="/products">View Products</Link>
            </Button>

            <form action={logoutAction}>
              <Button type="submit" variant="outline" className="w-full">
                Logout
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
