import { DashboardNav } from '@/components/dashboard/nav'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-100">
      <DashboardNav />
      <main className="container mx-auto py-6">{children}</main>
    </div>
  )
}