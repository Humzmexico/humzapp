import { Separator } from '@/components/ui/separator'

export function Header({ title }: { title: string }) {
  return (
    <div className="border-b">
      <div className="flex h-14 items-center gap-4 px-6">
        <h1 className="text-base font-semibold">{title}</h1>
        <Separator orientation="vertical" className="h-4" />
      </div>
    </div>
  )
}
