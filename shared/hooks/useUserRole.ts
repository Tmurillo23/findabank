"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/shared/services/supabase/client";
import type { UserRole } from "@/features/auth/types";

export function useUserRole() {
  const [role, setRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    const fetchUserRole = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
          const userRole = user.user_metadata?.role as UserRole | undefined;
          setRole(userRole || null);
        } else {
          setRole(null);
        }
      } catch (error) {
        console.error("Error fetching user role:", error);
        setRole(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUserRole();

    // Escuchar cambios de autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          const userRole = session.user.user_metadata?.role as UserRole | undefined;
          setRole(userRole || null);
        } else {
          setRole(null);
        }
        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return { role, loading };
}

