import { StatsCard } from '@/components/dashboard/stats-card'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default async function StoreDashboardPage() {
  const supabase = await createClient()

  // Get current user's store
  const { data: profile } = await supabase.auth.getUser()
  const { data: storeProfile } = await supabase
    .from('profiles')
    .select('id')
    .eq('id', profile.user?.id)
    .single()

  if (!storeProfile?.id) {
    return <div>Store profile not found</div>
  }

  // Fetch store stats
  const { data: todayTransactions } = await supabase
    .from('transactions')
    .select('amount')
    .gte('created_at', new Date(new Date().setHours(0, 0, 0, 0)).toISOString())
    .order('created_at', { ascending: false })

  const todayTotal = todayTransactions?.reduce((sum, tx) => sum + Number(tx.amount), 0) || 0
  const transactionsCount = todayTransactions?.length || 0

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Store Dashboard</h1>
          <p className="text-muted-foreground">Process transactions and view daily statistics</p>
        </div>
        <Button asChild>
          <Link href="/store/transaction">New Transaction</Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <StatsCard
          title="Today's Transactions"
          value={transactionsCount}
          description="Number of transactions today"
        />
        <StatsCard
          title="Today's Total"
          value={`$${todayTotal.toFixed(2)}`}
          description="Total amount processed today"
        />
      </div>
    </div>
  )
}
