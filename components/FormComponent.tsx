import React from 'react'
import { Link2 } from 'lucide-react';
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
interface FormDataType {
  name: string;
  tag: string;
  href: string;
  description: string;
}


const FormComponent = ({ formData, handleSubmit, isSubmitted,setFromData }:{formData: FormDataType, handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void, isSubmitted: boolean,setFromData: React.Dispatch<React.SetStateAction<FormDataType>>}) => {

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setFromData((prev) => ({ ...prev, [name]: value }));
    };
  return (
    <div>
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">
      <Card className="w-full max-w-lg p-6">
        <div className="flex flex-col space-y-1.5 pb-6">
          <h3 className="font-semibold leading-none tracking-tight text-xl flex items-center gap-2">
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
            <Label htmlFor="name">Name <span className="text-red-500">*</span></Label>
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
            <Label htmlFor="href">Link (URL) <span className="text-red-500">*</span></Label>
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
            <Label htmlFor="tag">Tag</Label>
            <Input
              id="tag"
              name="tag"
              placeholder="e.g., Framework, Tutorial, Resource"
              value={formData.tag}
              onChange={handleInputChange}
            />
          </div>

          {/* Description Field */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Briefly describe what this link is about..."
              className="resize-none"
              rows={3}
              value={formData.description}
              onChange={handleInputChange}
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
    </div>
    </div>
  )
}

export default FormComponent