import { StatsCard } from '@/components/dashboard/stats-card'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default async function BranchDashboardPage() {
  const supabase = await createClient()

  // Get current user's branch
  const { data: profile } = await supabase.auth.getUser()
  const { data: staffData } = await supabase
    .from('staff')
    .select('branch_id')
    .eq('profile_id', profile.user?.id)
    .single()

  if (!staffData?.branch_id) {
    return <div>No branch assigned</div>
  }

  // Fetch branch stats
  const { count: beneficiariesCount } = await supabase
    .from('beneficiaries')
    .select('*', { count: 'exact', head: true })
    .eq('branch_id', staffData.branch_id)

  const { data: recentBeneficiaries } = await supabase
    .from('beneficiaries')
    .select('created_at')
    .eq('branch_id', staffData.branch_id)
    .order('created_at', { ascending: false })
    .limit(7)

  const recentRegistrations = recentBeneficiaries?.length || 0

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Branch Dashboard</h1>
          <p className="text-muted-foreground">Manage beneficiaries and view statistics</p>
        </div>
        <Button asChild>
          <Link href="/branch/register">Register New Beneficiary</Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <StatsCard
          title="Total Beneficiaries"
          value={beneficiariesCount || 0}
          description="Registered at this branch"
        />
        <StatsCard
          title="Recent Registrations"
          value={recentRegistrations}
          description="In the last 7 days"
        />
      </div>
    </div>
  )
}
