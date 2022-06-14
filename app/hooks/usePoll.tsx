import { useEffect, useState } from "react";
import { useFetcher } from "@remix-run/react";

export function usePoll<T>(endpoint: string, initialData: T) {
  const fetcher = useFetcher();
  const [data, setData] = useState<T>(initialData);

  useEffect(() => setData(initialData), [initialData]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (document.visibilityState === "visible") {
        fetcher.load(endpoint);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (fetcher.data) {
      setData(fetcher.data);
    }
  }, [fetcher.data]);

  return data;
}
