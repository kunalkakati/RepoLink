// store/linkStore.ts
import { create } from "zustand";
import { Link, LinkInsertType } from "@/db/schema";
import { getAllLinks, addLink, deleteLink } from "@/lib/action";

interface LinkStore {
  links: Link[];
  isLoading: boolean;
  error: string | null;

  fetchLinks: () => Promise<void>;
  addLink: (data: LinkInsertType) => Promise<void>;
  deleteLink: (id: string) => Promise<void>;
}

export const useLinkStore = create<LinkStore>((set) => ({
  links: [],
  isLoading: false,
  error: null,

  fetchLinks: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await getAllLinks();
      set({ links: data });
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
      set((state) => ({ links: [...state.links, newLink] }));
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
      set((state) => ({ links: state.links.filter(link => link.id !== id) }));
    } catch (err) {
      console.log(err);
      set({ error: "Failed to delete link" });
    } finally {
      set({ isLoading: false });
    }
  },
}));