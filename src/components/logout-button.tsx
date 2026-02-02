"use client";

import { Button } from "@/components/ui/button";
import { logoutAction } from "@/app/(protected)/dashboard/action";

export function LogoutButton() {
  return (
    <Button onClick={() => logoutAction()} variant="outline">
      Logout
    </Button>
  );
}
