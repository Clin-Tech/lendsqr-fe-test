import { useEffect, useState } from "react";
import type { User } from "../../types/user";

export function useUsers(page = 1, perPage = 100) {
  const [data, setData] = useState<{ total: number; items: User[] } | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(true);
    fetch(`/api/users?page=${page}&perPage=${perPage}`)
      .then((r) => r.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, [page, perPage]);
  return { data, loading };
}
