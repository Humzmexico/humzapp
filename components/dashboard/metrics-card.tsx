import { Card, CardContent } from '@/components/ui/card'
import { ReactNode } from 'react'

interface MetricsCardProps {
  title: string
  value: string
  icon: ReactNode
  trend?: string
}

export function MetricsCard({ title, value, icon, trend }: MetricsCardProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <h3 className="text-2xl font-bold mt-2">{value}</h3>
            {trend && (
              <p className="text-xs text-muted-foreground mt-2">{trend}</p>
            )}
          </div>
          <div className="p-2 bg-muted rounded-lg text-primary">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
