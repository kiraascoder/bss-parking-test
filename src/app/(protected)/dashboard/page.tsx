import { redirect } from "next/navigation";
import { createSupabaseServer } from "@/lib/supabase/server";
import { logoutAction } from "./action";
import Link from "next/link";

export default async function DashboardPage() {
  const supabase = await createSupabaseServer();
  const { data } = await supabase.auth.getUser();

  if (!data.user) redirect("/login");

  return (
    <div className="p-6 space-y-4">
      <p>Welcome, {data.user.email}</p>

      <form action={logoutAction}>
        <button className="rounded bg-red-500 px-4 py-2 text-white">
          Logout
        </button>
      </form>
      <Link href="/product">Product</Link>
    </div>
  );
}
