'use client'

import { useEffect, useState } from 'react'
import { Bell, User, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function Topbar() {
  const [user, setUser] = useState<{ name: string; email: string } | null>(null)

  useEffect(() => {
    // Load user from API or auth context
    setUser({
      name: 'Demo User',
      email: 'demo@humz.app',
    })
  }, [])

  return (
    <header className="h-16 border-b border-border bg-card flex items-center justify-between px-8">
      <div className="flex-1" />

      <div className="flex items-center gap-4">
        {/* Notifications */}
        <Button variant="ghost" size="icon">
          <Bell className="w-5 h-5" />
        </Button>

        {/* User Menu */}
        {user && (
          <div className="flex items-center gap-3 pl-4 border-l border-border">
            <div className="text-right">
              <p className="text-sm font-medium">{user.name}</p>
              <p className="text-xs text-muted-foreground">{user.email}</p>
            </div>
            <Button variant="ghost" size="icon">
              <User className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" title="Logout">
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        )}
      </div>
    </header>
  )
}
