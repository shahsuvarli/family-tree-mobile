import { useCallback, useEffect, useState } from "react";
import { fetchProfileOverview } from "@/features/profile/services/profileService";
import { showErrorToast } from "@/lib/toast";

interface UseProfileOverviewResult<TData = any> {
  data: TData | undefined;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useProfileOverview<TData = any>(
  userId: string | null,
  isFocused: boolean = true,
): UseProfileOverviewResult<TData> {
  const [data, setData] = useState<TData>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!userId) {
      setData(undefined);
      setError(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data: overview, error: overviewError } = await fetchProfileOverview(
        userId,
      );

      if (overviewError) {
        console.error("Failed to load profile overview", overviewError.message);
        setError("Failed to load profile overview.");
        showErrorToast(
          "Error",
          "Could not load your profile overview. Please try again.",
        );
        setData(undefined);
      } else {
        setData(overview as TData);
        setError(null);
      }
    } catch (err) {
      console.error("Unexpected profile overview error", err);
      setError("Something went wrong while loading your profile.");
      showErrorToast(
        "Error",
        "Something went wrong while loading your profile.",
      );
      setData(undefined);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (isFocused) {
      void load();
    }
  }, [isFocused, load]);

  return {
    data,
    loading,
    error,
    refetch: load,
  };
}

