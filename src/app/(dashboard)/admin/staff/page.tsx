import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'

export default async function StaffPage() {
  const supabase = await createClient()
  
  const { data: staff } = await supabase
    .from('staff')
    .select(`
      *,
      profile:profiles(full_name, email, phone_number),
      branch:branches(name)
    `)
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Branch Staff</h1>
          <p className="text-muted-foreground">Manage branch staff members</p>
        </div>
        <Button>Add Staff Member</Button>
      </div>

      <div className="rounded-md border">
        <div className="p-4">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="pb-4 text-left">Name</th>
                <th className="pb-4 text-left">Email</th>
                <th className="pb-4 text-left">Phone</th>
                <th className="pb-4 text-left">Branch</th>
                <th className="pb-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {staff?.map((member) => (
                <tr key={member.id} className="border-b">
                  <td className="py-4">{member.profile?.full_name}</td>
                  <td className="py-4">{member.profile?.email}</td>
                  <td className="py-4">{member.profile?.phone_number}</td>
                  <td className="py-4">{member.branch?.name}</td>
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
