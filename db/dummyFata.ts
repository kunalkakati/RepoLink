// import { v4 as uuidv4 } from "uuid";
import { NewLink } from "./schema";

export const seedLinks: NewLink[] = [
  {
   
    name: "Next.js Documentation",
    href: "https://nextjs.org/docs",
    tag: "docs",
    description: "Official documentation for Next.js, the React framework for production.",
    createdAt: new Date("2024-01-15T10:00:00Z"),
  },
  {
    
    name: "Drizzle ORM",
    href: "https://orm.drizzle.team",
    tag: "tool",
    description: "Lightweight TypeScript ORM with a SQL-like query API and full type safety.",
    createdAt: new Date("2024-02-01T09:30:00Z"),
  },
  {
    
    name: "Tailwind CSS",
    href: "https://tailwindcss.com",
    tag: "tool",
    description: "A utility-first CSS framework for rapidly building custom user interfaces.",
    createdAt: new Date("2024-02-10T14:00:00Z"),
  },
  {
    
    name: "TypeScript Handbook",
    href: "https://www.typescriptlang.org/docs/handbook/intro.html",
    tag: "docs",
    description: "The official TypeScript handbook covering all core language features.",
    createdAt: new Date("2024-03-05T08:00:00Z"),
  },
  {
    
    name: "Vercel Platform",
    href: "https://vercel.com",
    tag: "platform",
    description: "Cloud platform for deploying and scaling frontend apps and serverless functions.",
    createdAt: new Date("2024-03-20T11:00:00Z"),
  },
  {
    
    name: "Supabase",
    href: "https://supabase.com",
    tag: "platform",
    description: "Open source Firebase alternative with a Postgres database, auth, and storage.",
    createdAt: new Date("2024-04-01T16:00:00Z"),
  },
  {
    
    name: "shadcn/ui",
    href: "https://ui.shadcn.com",
    tag: "library",
    description: "Beautifully designed, accessible component library built with Radix UI and Tailwind.",
    createdAt: new Date("2024-04-12T13:00:00Z"),
  },
  {
    
    name: "Zod",
    href: "https://zod.dev",
    tag: "library",
    description: "TypeScript-first schema declaration and runtime validation library.",
    createdAt: new Date("2024-05-07T10:30:00Z"),
  },
  {
    
    name: "React Query",
    href: "https://tanstack.com/query/latest",
    tag: "library",
    description: "Powerful async state management for fetching, caching, and syncing server data.",
    createdAt: new Date("2024-05-18T09:00:00Z"),
  },
  {
    
    name: "PostgreSQL Docs",
    href: "https://www.postgresql.org/docs/",
    tag: "docs",
    description: "Comprehensive official documentation for the PostgreSQL relational database.",
    createdAt: new Date("2024-06-01T07:45:00Z"),
  },
];