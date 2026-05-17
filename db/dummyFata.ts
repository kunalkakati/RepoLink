// import { v4 as uuidv4 } from "uuid";
import { NewLink } from "./schema";

export const seedLinks: NewLink[] = [
  {
    name: "Next.js Documentation",
    href: "https://nextjs.org/docs",
    tag: "docs",
    createdAt: new Date("2024-01-15T10:00:00Z"),
  },
  {
    name: "Drizzle ORM",
    href: "https://orm.drizzle.team",
    tag: "tool",
    createdAt: new Date("2024-02-01T09:30:00Z"),
  },
  {
    name: "Tailwind CSS",
    href: "https://tailwindcss.com",
    tag: "tool",
    createdAt: new Date("2024-02-10T14:00:00Z"),
  },
  {
    name: "TypeScript Handbook",
    href: "https://www.typescriptlang.org/docs/handbook/intro.html",
    tag: "docs",
    createdAt: new Date("2024-03-05T08:00:00Z"),
  },
  {
    name: "Vercel Platform",
    href: "https://vercel.com",
    tag: "platform",
    createdAt: new Date("2024-03-20T11:00:00Z"),
  },
  {
    name: "Supabase",
    href: "https://supabase.com",
    tag: "platform",
    createdAt: new Date("2024-04-01T16:00:00Z"),
  },
  {
    name: "shadcn/ui",
    href: "https://ui.shadcn.com",
    tag: "library",
    createdAt: new Date("2024-04-12T13:00:00Z"),
  },
  {
    name: "Zod",
    href: "https://zod.dev",
    tag: "library",
    createdAt: new Date("2024-05-07T10:30:00Z"),
  },
  {
    name: "React Query",
    href: "https://tanstack.com/query/latest",
    tag: "library",
    createdAt: new Date("2024-05-18T09:00:00Z"),
  },
  {
    name: "PostgreSQL Docs",
    href: "https://www.postgresql.org/docs/",
    tag: "docs",
    createdAt: new Date("2024-06-01T07:45:00Z"),
  },
];
