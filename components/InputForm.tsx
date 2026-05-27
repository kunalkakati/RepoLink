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
  const { addLink } = useLinkStore();
  const [formData, setFormData] = useState<Omit<LinkInsertType, "tag">>({
    name: "",
    href: "",
  });
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const { dbTagOptions: optionsToShow } = useTags();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    addLink({
      ...formData,
      tag: normalizeTags(selectedTags),
    });

    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 3000);

    setFormData({ name: "", href: "" });
    setSelectedTags([]);
  };

  return (
    <div>
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 font-sans">
        <Card className="w-full max-w-lg rounded-[28px] p-6 sm:p-8 mb-8">
          <div className="flex flex-col space-y-1.5 pb-6">
            <h3 className="font-semibold leading-none tracking-tight text-xl flex flex-col gap-2 sm:flex-row sm:items-center">
              <Link2 className="w-5 h-5 text-slate-500" />
              Add New Resource
            </h3>
            <p className="text-sm text-slate-500">
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
