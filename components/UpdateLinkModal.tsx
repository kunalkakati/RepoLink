"use client";

import React, { useState } from "react";
import { X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useLinkStore } from "@/store/LinkStore";
import { normalizeTags } from "@/lib/utils";
import { useTags } from "@/hooks/useTags";
import { TagInput } from "@/components/TagInput";

interface UpdateLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  link: {
    id: string;
    name: string;
    href: string;
    tags: string[];
  };
}

export default function UpdateLinkModal({
  isOpen,
  onClose,
  link,
}: UpdateLinkModalProps) {
  const { updateLink } = useLinkStore();
  const { dbTagOptions } = useTags();
  
  const [formData, setFormData] = useState({
    name: link.name,
    href: link.href,
  });
  const [selectedTags, setSelectedTags] = useState<string[]>(link.tags || []);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await updateLink(link.id, {
        name: formData.name,
        href: formData.href,
        tag: normalizeTags(selectedTags),
      });
      onClose();
    } catch (error) {
      console.error("Failed to update link", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div 
        className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <h3 className="text-lg font-semibold text-slate-800">Edit Link</h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:bg-slate-200 hover:text-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name <span className="text-red-500">*</span></Label>
            <Input
              id="name"
              name="name"
              required
              value={formData.name}
              onChange={handleInputChange}
              className="rounded-xl"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="href">Link (URL) <span className="text-red-500">*</span></Label>
            <Input
              id="href"
              name="href"
              type="url"
              required
              value={formData.href}
              onChange={handleInputChange}
              className="rounded-xl"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Tags</Label>
            <TagInput
              selectedTags={selectedTags}
              onChange={setSelectedTags}
              options={dbTagOptions}
            />
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="rounded-xl"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="rounded-xl bg-blue-600 hover:bg-blue-700"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
