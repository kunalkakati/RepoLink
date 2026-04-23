'use client'

import { Bookmark, HomeIcon, PlusIcon } from 'lucide-react'
import Link from 'next/link'
import { useDeleteStore } from '@/store/DeleteStore'
import { Checkbox } from '@/components/ui/checkbox'

const Navbar = () => {
  const { enableDelete, setEnableDelete } = useDeleteStore()

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur-xl shadow-sm">
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-4 px-4 py-4 sm:flex-row sm:items-center sm:px-6">
        <Link href="/" className="inline-flex items-center gap-3 text-lg font-semibold text-foreground">
          <span className="grid h-10 w-10 place-items-center rounded-3xl bg-slate-950 text-white shadow-sm">
            <Bookmark className="h-4 w-4" />
          </span>
          LinkVault
        </Link>

        <nav className="flex w-full flex-col gap-2 sm:flex-row sm:items-center sm:gap-2">
          <div className="flex items-center gap-2">
            <Checkbox
              id="enable-delete"
              checked={enableDelete}
              onCheckedChange={(checked) => setEnableDelete(checked as boolean)}
            />
            <label htmlFor="enable-delete" className="text-sm font-medium">
              Enable Delete
            </label>
          </div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-foreground transition hover:bg-muted"
          >
            <HomeIcon className="h-4 w-4" /> Home
          </Link>
          <Link
            href="/form"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary/95"
          >
            <PlusIcon className="h-4 w-4" /> Add link
          </Link>
        </nav>
      </div>
    </header>
  )
}

export default Navbar
