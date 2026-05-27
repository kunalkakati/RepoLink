// store/linkStore.ts
import { create } from "zustand";
import { Link, LinkInsertType, NewLink } from "@/db/schema";
import { getAllLinks, addLink, deleteLink, updateLink } from "@/lib/action";

interface LinkStore {
  links: Link[];
  isLoading: boolean;
  error: string | null;

  fetchLinks: () => Promise<void>;
  addLink: (data: LinkInsertType) => Promise<void>;
  deleteLink: (id: string) => Promise<void>;
  updateLink: (id: string, data: Partial<NewLink>) => Promise<void>;
}

const LINK_CACHE_KEY = "seedlink-links-cache";
const LINK_CACHE_TTL = 1000 * 60 * 2; // 2 minutes

const loadLinkCache = () => {
  if (typeof window === "undefined") return null;
  try {
    const cached = window.localStorage.getItem(LINK_CACHE_KEY);
    if (!cached) return null;
    const parsed = JSON.parse(cached);
    if (parsed?.expiresAt && parsed?.data && Date.now() < parsed.expiresAt) {
      return parsed.data as Link[];
    }
  } catch {
    // ignore invalid cache
  }
  return null;
};

const saveLinkCache = (links: Link[]) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(
    LINK_CACHE_KEY,
    JSON.stringify({ expiresAt: Date.now() + LINK_CACHE_TTL, data: links }),
  );
};

export const useLinkStore = create<LinkStore>((set) => ({
  links: [],
  isLoading: false,
  error: null,

  fetchLinks: async () => {
    const cachedLinks = loadLinkCache();
    if (cachedLinks) {
      set({ links: cachedLinks, isLoading: false, error: null });
      return;
    }

    set({ isLoading: true, error: null });
    try {
      const data = await getAllLinks();
      set({ links: data });
      saveLinkCache(data);
    } catch (error) {
      set({ error: "Failed to fetch links" });
      console.log(error);
    } finally {
      set({ isLoading: false });
    }
  },

  addLink: async (data: LinkInsertType) => {
    set({ isLoading: true, error: null });
    try {
      const [newLink] = await addLink(data);
      set((state) => {
        const links = [...state.links, newLink];
        saveLinkCache(links);
        return { links };
      });
    } catch (err) {
      console.log(err);
      set({ error: "Failed to add link" });
    } finally {
      set({ isLoading: false });
    }
  },

  deleteLink: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await deleteLink(id);
      set((state) => {
        const links = state.links.filter((link) => link.id !== id);
        saveLinkCache(links);
        return { links };
      });
    } catch (err) {
      console.log(err);
      set({ error: "Failed to delete link" });
    } finally {
      set({ isLoading: false });
    }
  },

  updateLink: async (id: string, data: Partial<NewLink>) => {
    set({ isLoading: true, error: null });
    try {
      const [updatedLink] = await updateLink(id, data);
      set((state) => {
        const links = state.links.map((link) => 
          link.id === id ? { ...link, ...updatedLink } : link
        );
        saveLinkCache(links);
        return { links };
      });
    } catch (err) {
      console.log(err);
      set({ error: "Failed to update link" });
    } finally {
      set({ isLoading: false });
    }
  },
}));
