import { StatsCard } from '@/components/dashboard/stats-card'
import { createClient } from '@/lib/supabase/server'

export default async function AdminDashboardPage() {
  const supabase = await createClient()

  // Fetch stats
  const { count: beneficiariesCount } = await supabase
    .from('beneficiaries')
    .select('*', { count: 'exact', head: true })

  const { count: branchesCount } = await supabase
    .from('branches')
    .select('*', { count: 'exact', head: true })

  const { count: storesCount } = await supabase
    .from('stores')
    .select('*', { count: 'exact', head: true })

  const { data: recentTransactions } = await supabase
    .from('transactions')
    .select('amount')
    .order('created_at', { ascending: false })
    .limit(10)

  const totalAmount = recentTransactions?.reduce((sum, tx) => sum + Number(tx.amount), 0) || 0

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">Overview of the financial aid system</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Beneficiaries"
          value={beneficiariesCount || 0}
          description="Registered beneficiaries"
        />
        <StatsCard
          title="Active Branches"
          value={branchesCount || 0}
          description="Operating branches"
        />
        <StatsCard
          title="Partner Stores"
          value={storesCount || 0}
          description="Registered stores"
        />
        <StatsCard
          title="Recent Transactions"
          value={`$${totalAmount.toFixed(2)}`}
          description="Last 10 transactions total"
        />
      </div>
    </div>
  )
}
