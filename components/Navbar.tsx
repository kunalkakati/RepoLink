"use client";

import { Bookmark, HomeIcon, PlusIcon, Menu, X, Settings } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useDeleteStore } from "@/store/DeleteStore";
import { Checkbox } from "@/components/ui/checkbox";
import useAuthStore from "@/store/AuthStore";
import { ThemeToggle } from "./ThemeToggle";

const Navbar = () => {
  const { enableDelete, setEnableDelete } = useDeleteStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated } = useAuthStore();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl backdrop-saturate-150 supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center space-x-3 transition-opacity hover:opacity-80"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-slate-900 to-slate-800 shadow-lg">
            <Bookmark className="h-4 w-4 text-white" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">
            LinkVault
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center space-x-1 md:flex">
          <div className="flex items-center space-x-2 rounded-lg border border-border/50 bg-muted/50 px-3 py-1.5">
            <Checkbox
              id="enable-delete"
              checked={enableDelete}
              onCheckedChange={(checked) => setEnableDelete(checked as boolean)}
              className="h-4 w-4"
            />
            <label
              htmlFor="enable-delete"
              className="text-sm font-medium text-muted-foreground"
            >
              Enable Edit
            </label>
          </div>

          <Link
            href="/"
            className="flex items-center space-x-2 rounded-lg px-3 py-2 text-sm font-medium text-foreground transition-all hover:bg-muted hover:text-foreground"
          >
            <HomeIcon className="h-4 w-4" />
            <span>Home</span>
          </Link>

          <Link
            href="/form"
            className={`flex items-center space-x-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-2 text-sm font-semibold text-white shadow-lg transition-all hover:from-blue-700 hover:to-blue-800 hover:shadow-xl ${isAuthenticated ? "" : "hidden"}`}
          >
            <PlusIcon className="h-4 w-4" />
            <span>Add Link</span>
          </Link>

          <Link
            href="/tags"
            className={`flex items-center space-x-2 rounded-lg px-3 py-2 text-sm font-medium text-foreground transition-all hover:bg-muted hover:text-foreground ${isAuthenticated ? "" : "hidden"}`}
          >
            <span>Manage Tags</span>
          </Link>

          <Link
            href="/settings"
            className="flex items-center space-x-2 rounded-lg px-3 py-2 text-sm font-medium text-foreground transition-all hover:bg-muted hover:text-foreground"
          >
            <Settings className="h-4 w-4" />
            <span>Settings</span>
          </Link>
          <ThemeToggle />
        </nav>

        <div className="flex items-center space-x-2 md:hidden">
          <ThemeToggle />
          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border/50 bg-muted/50 transition-all hover:bg-muted"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMenuOpen ? (
              <X className="h-5 w-5 text-foreground" />
            ) : (
              <Menu className="h-5 w-5 text-foreground" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="border-t border-border/40 bg-background/95 backdrop-blur-xl md:hidden">
          <div className="container mx-auto max-w-7xl space-y-1 px-4 py-4 sm:px-6">
            <div className="flex items-center space-x-3 rounded-lg border border-border/50 bg-muted/50 px-3 py-3">
              <Checkbox
                id="enable-delete-mobile"
                checked={enableDelete}
                onCheckedChange={(checked) =>
                  setEnableDelete(checked as boolean)
                }
                className="h-4 w-4"
              />
              <label
                htmlFor="enable-delete-mobile"
                className="text-sm font-medium text-muted-foreground"
              >
                Enable Delete
              </label>
            </div>

            <Link
              href="/"
              className="flex items-center space-x-3 rounded-lg px-3 py-3 text-sm font-medium text-foreground transition-all hover:bg-muted"
              onClick={() => setIsMenuOpen(false)}
            >
              <HomeIcon className="h-5 w-5" />
              <span>Home</span>
            </Link>

            <Link
              href="/form"
              className={`flex items-center space-x-3 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 px-3 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:from-blue-700 hover:to-blue-800 ${isAuthenticated ? "" : "hidden"}`}
              onClick={() => setIsMenuOpen(false)}
            >
              <PlusIcon className="h-5 w-5" />
              <span>Add Link</span>
            </Link>

            <Link
              href="/tags"
              className={`flex items-center space-x-3 rounded-lg px-3 py-3 text-sm font-semibold text-foreground transition-all hover:bg-muted ${isAuthenticated ? "" : "hidden"}`}
              onClick={() => setIsMenuOpen(false)}
            >
              <span>Manage Tags</span>
            </Link>

            <Link
              href="/settings"
              className="flex items-center space-x-3 rounded-lg px-3 py-3 text-sm font-semibold text-foreground transition-all hover:bg-muted"
              onClick={() => setIsMenuOpen(false)}
            >
              <Settings className="h-5 w-5" />
              <span>Settings</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
