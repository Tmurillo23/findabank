"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/shared/services/supabase/client";
import type { UserRole } from "@/features/auth/types";

export function useUserRole() {
  const [role, setRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const supabase = createClient();
        const { data } = await supabase.auth.getClaims();
        const userRole = data?.claims?.["custom:role"] as UserRole | undefined;
        setRole(userRole || null);
      } catch (error) {
        console.error("Error fetching user role:", error);
        setRole(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUserRole();
  }, []);

  return { role, loading };
}

