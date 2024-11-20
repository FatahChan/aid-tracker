import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'

export default async function BranchesPage() {
  const supabase = await createClient()
  
  const { data: branches } = await supabase
    .from('branches')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Branches</h1>
          <p className="text-muted-foreground">Manage branch locations</p>
        </div>
        <Button>Add Branch</Button>
      </div>

      <div className="rounded-md border">
        <div className="p-4">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="pb-4 text-left">Name</th>
                <th className="pb-4 text-left">Address</th>
                <th className="pb-4 text-left">Contact</th>
                <th className="pb-4 text-left">Status</th>
                <th className="pb-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {branches?.map((branch) => (
                <tr key={branch.id} className="border-b">
                  <td className="py-4">{branch.name}</td>
                  <td className="py-4">{branch.address}</td>
                  <td className="py-4">{branch.contact_number}</td>
                  <td className="py-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      branch.status ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {branch.status ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="py-4">
                    <Button variant="ghost" size="sm">Edit</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
