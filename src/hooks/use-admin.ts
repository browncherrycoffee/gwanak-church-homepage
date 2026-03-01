"use client";

import { useEffect, useState } from "react";

export function useAdmin() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth")
      .then((res) => setIsAdmin(res.ok))
      .catch(() => setIsAdmin(false))
      .finally(() => setLoading(false));
  }, []);

  return { isAdmin, loading };
}
