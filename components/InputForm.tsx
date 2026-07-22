"use client";

import React, { useEffect, useState } from "react";
import { Link2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { LinkInsertType } from "@/db/schema";
import { useLinkStore } from "@/store/LinkStore";
import { normalizeTags } from "@/lib/utils";
import { useTags } from "@/hooks/useTags";
import { Bookmarklet } from "@/components/Bookmarklet";
import { TagInput } from "@/components/TagInput";

export default function InputForm() {
  const { addLink, links } = useLinkStore();
  const [formData, setFormData] = useState<Omit<LinkInsertType, "tag">>({
    name: "",
    href: "",
  });
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const { dbTagOptions: optionsToShow } = useTags();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formError) {
      setFormError(null);
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const urlParam = params.get("url");
      const titleParam = params.get("title");
      if (urlParam || titleParam) {
        const timeout = setTimeout(() => {
          setFormData((prev) => ({
            ...prev,
            href: urlParam || prev.href,
            name: titleParam || prev.name,
          }));
        }, 0);
        return () => clearTimeout(timeout);
      }
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmedName = formData.name.trim();

    if (
      links.some(
        (link) => link.name.trim().toLowerCase() === trimmedName.toLowerCase(),
      )
    ) {
      setFormError("A link with that name already exists.");
      return;
    }

    try {
      await addLink({
        ...formData,
        tag: normalizeTags(selectedTags),
      });

      setFormError(null);
      setIsSubmitted(true);
      setTimeout(() => setIsSubmitted(false), 3000);

      setFormData({ name: "", href: "" });
      setSelectedTags([]);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to save link";
      setFormError(message);
    }
  };

  return (
    <div>
      <div className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.18),transparent_55%)] bg-slate-950 flex flex-col items-center justify-center p-4 font-sans">
        <Card className="mb-8 w-full max-w-lg rounded-[28px] border border-white/10 bg-slate-900/90 p-6 text-slate-100 shadow-2xl shadow-black/30 sm:p-8">
          <div className="flex flex-col space-y-1.5 pb-6">
            <h3 className="flex flex-col gap-2 text-xl font-semibold leading-none tracking-tight sm:flex-row sm:items-center">
              <Link2 className="h-5 w-5 text-slate-400" />
              Add New Resource
            </h3>
            <p className="text-sm text-slate-400">
              Enter the details below to save a new link.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Field */}
            <div className="space-y-2">
              <Label htmlFor="name">
                Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                name="name"
                required
                placeholder="e.g., Next.js Documentation"
                value={formData.name}
                onChange={handleInputChange}
              />
              {formError ? (
                <p className="text-sm text-red-600">{formError}</p>
              ) : null}
            </div>

            {/* Href / Link Field */}
            <div className="space-y-2">
              <Label htmlFor="href">
                Link (URL) <span className="text-red-500">*</span>
              </Label>
              <Input
                id="href"
                name="href"
                type="url"
                required
                placeholder="https://nextjs.org/docs"
                value={formData.href}
                onChange={handleInputChange}
              />
            </div>

            {/* Tag Field */}
            <div className="space-y-2">
              <Label htmlFor="tag">Tags</Label>
              <TagInput
                selectedTags={selectedTags}
                onChange={setSelectedTags}
                options={optionsToShow}
              />
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <Button type="submit" className="w-full">
                {isSubmitted ? "Saved Successfully!" : "Save Link"}
              </Button>
            </div>
          </form>
        </Card>

        <Bookmarklet />
      </div>
    </div>
  );
}
