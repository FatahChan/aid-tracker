import { createClient } from "@/lib/supabase/server"
import { ProfilePictureUploader } from "@/components/beneficiary/profile-picture-uploader"

export default async function BeneficiaryProfilePage({
  params,
}: {
  params: { id: string }
}) {
  const supabase = await createClient()
  
  const { data } = await supabase
    .from("profiles")
    .select("profile_picture_url")
    .eq("id", params.id)
    .single()

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Manage Beneficiary Profile Picture</h1>
      
      <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow">
        <ProfilePictureUploader 
          beneficiaryId={params.id} 
          currentPictureUrl={data?.profile_picture_url ?? null} 
        />
      </div>
    </div>
  )
}