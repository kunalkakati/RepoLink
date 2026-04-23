'use client'

import { DeleteProvider } from '@/lib/DeleteContext'

export default function Providers({ children }: { children: React.ReactNode }) {
  return <DeleteProvider>{children}</DeleteProvider>
}