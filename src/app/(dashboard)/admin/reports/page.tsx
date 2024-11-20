import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'

export default async function ReportsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Reports</h1>
        <p className="text-muted-foreground">Generate and download system reports</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-lg border p-6">
          <h3 className="text-lg font-medium">Transaction Report</h3>
          <p className="mt-2 text-sm text-gray-600">
            Download a report of all transactions within a specified date range
          </p>
          <div className="mt-4">
            <Button>Generate Report</Button>
          </div>
        </div>

        <div className="rounded-lg border p-6">
          <h3 className="text-lg font-medium">Beneficiary Report</h3>
          <p className="mt-2 text-sm text-gray-600">
            Download a report of all registered beneficiaries and their status
          </p>
          <div className="mt-4">
            <Button>Generate Report</Button>
          </div>
        </div>

        <div className="rounded-lg border p-6">
          <h3 className="text-lg font-medium">Branch Performance</h3>
          <p className="mt-2 text-sm text-gray-600">
            View registration and transaction statistics by branch
          </p>
          <div className="mt-4">
            <Button>Generate Report</Button>
          </div>
        </div>

        <div className="rounded-lg border p-6">
          <h3 className="text-lg font-medium">Store Activity</h3>
          <p className="mt-2 text-sm text-gray-600">
            Analyze transaction patterns and store activity
          </p>
          <div className="mt-4">
            <Button>Generate Report</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
