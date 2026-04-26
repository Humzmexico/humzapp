'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Users,
  DollarSign,
  MessageSquare,
  ChevronRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { AuthUser } from '@/lib/auth'

const navItems = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Clientes', href: '/dashboard/clients', icon: Users },
  { label: 'Finanzas', href: '/dashboard/finances', icon: DollarSign },
  { label: 'Mensajes', href: '/dashboard/messages', icon: MessageSquare },
]

export function Sidebar({ user }: { user: AuthUser }) {
  const pathname = usePathname()

  return (
    <aside className="flex h-screen w-60 flex-col border-r bg-white">
      {/* Logo */}
      <div className="flex h-14 items-center gap-2 border-b px-5">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-foreground text-background text-xs font-bold">
          H
        </div>
        <span className="text-sm font-semibold">Humz</span>
      </div>

      {/* Nav */}
      <nav className="flex flex-1 flex-col gap-1 p-3">
        {navItems.map(({ label, href, icon: Icon }) => {
          const active = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                active
                  ? 'bg-accent text-accent-foreground'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
              {active && <ChevronRight className="ml-auto h-3 w-3 opacity-50" />}
            </Link>
          )
        })}
      </nav>

      {/* User */}
      <div className="border-t p-3">
        <div className="flex items-center gap-3 rounded-md px-3 py-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-muted text-xs font-medium uppercase">
            {user.name.charAt(0)}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium leading-none">{user.name}</p>
            <p className="truncate text-xs text-muted-foreground mt-0.5">{user.email}</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
