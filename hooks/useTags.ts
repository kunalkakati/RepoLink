import { useState, useEffect } from "react";
import type { TagOption } from "@/options/TagOptions";

export function useTags() {
  const cachedTagOptions = loadCachedTagOptions();
  const [dbTagOptions, setDbTagOptions] = useState<TagOption[]>(
    cachedTagOptions ?? [],
  );
  const [tagLoading, setTagLoading] = useState<boolean>(
    cachedTagOptions ? false : true,
  );

  function loadCachedTagOptions() {
    if (typeof window === "undefined") return null;
    try {
      const cached = window.localStorage.getItem("seedlink-tag-options");
      if (!cached) return null;
      const parsed = JSON.parse(cached);
      if (parsed?.expiresAt && parsed?.data && Date.now() < parsed.expiresAt) {
        return parsed.data as TagOption[];
      }
    } catch {
      // ignore invalid cache
    }
    return null;
  }

  function saveTagOptionsCache(tags: TagOption[]) {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(
      "seedlink-tag-options",
      JSON.stringify({
        expiresAt: Date.now() + 1000 * 60 * 15,
        data: tags,
      }),
    );
  }

  useEffect(() => {
    const controller = new AbortController();

    fetch("/api/tags", { signal: controller.signal })
      .then(async (res) => {
        if (!res.ok) throw new Error("Failed to load tag options");
        return res.json();
      })
      .then((data: TagOption[]) => {
        if (Array.isArray(data)) {
          const mapped = data.map((tag) => ({
            id: tag.id,
            value: tag.value,
            label: tag.label || tag.value,
            color: tag.color || "",
          }));
          setDbTagOptions(mapped);
          saveTagOptionsCache(mapped);
        }
      })
      .catch((error) => {
        if (error.name !== 'AbortError') {
          console.error("Error loading tags:", error);
        }
      })
      .finally(() => setTagLoading(false));

    return () => controller.abort();
  }, []);

  return { dbTagOptions, tagLoading };
}
