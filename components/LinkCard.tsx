"use client"

import { useState } from "react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ExternalLink, Copy, Trash2 } from "lucide-react"
import { useDeleteStore } from "@/store/DeleteStore"
import { useLinkStore } from "@/store/LinkStore"

interface LinkCardProps {
  id: string
  name: string
  href: string
  tags?: string[]
  description?: string
}

export default function LinkCard({ id, name: title, href: url, tags = [], description }: LinkCardProps) {
  const [copied, setCopied] = useState(false)
  const { enableDelete } = useDeleteStore()
  const { deleteLink } = useLinkStore()

  const handleCopy = async () => {
    if (!navigator?.clipboard) return

    try {
      await navigator.clipboard.writeText(title)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1200)
    } catch {
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1200)
    }
  }

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this link?')) {
      await deleteLink(id)
    }
  }

  return (
    <Card size="xs" className="w-full max-w-xs min-w-0 shrink-0 relative">
      <CardHeader className="pb-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <CardTitle className="text-sm font-semibold tracking-tight break-words">{title}</CardTitle>
          <div className="flex flex-wrap items-center gap-2 justify-end">
            <button
              type="button"
              onClick={handleCopy}
              aria-label="Copy name"
              className="inline-flex h-8 items-center justify-center rounded-full border border-border bg-muted px-2 text-[11px] font-semibold text-foreground transition hover:bg-muted/95 cursor-pointer"
            >
              {copied ? "Copied" : <Copy className="h-3.5 w-3.5" />}
            </button>
            {enableDelete && (
              <button
                type="button"
                onClick={handleDelete}
                aria-label="Delete link"
                className="inline-flex h-8 items-center justify-center rounded-full border border-border bg-destructive px-2 text-[11px] font-semibold text-destructive-foreground transition hover:bg-destructive/95 cursor-pointer"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {description ? (
          <p className="text-xs leading-5 text-muted-foreground">{description}</p>
        ) : null}
        <div className="flex flex-wrap gap-2">
          {tags.length > 0 ? (
            tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-[11px] px-2 py-1">
                {tag}
              </Badge>
            ))
          ) : (
            <span className="text-xs text-muted-foreground">No tags</span>
          )}
        </div>
      </CardContent>

      <CardFooter className="pt-0">
        <Link
          href={url}
          target="_blank"
          rel="noreferrer"
          className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground transition hover:bg-primary/95"
        >
          Open link <ExternalLink className="h-3.5 w-3.5" />
        </Link>
      </CardFooter>

      
    </Card>
  )
}
