"use client"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import Image from "next/image"

interface ProfilePictureUploaderProps {
  beneficiaryId: string
  currentPictureUrl: string | null
}

export function ProfilePictureUploader({
  beneficiaryId,
  currentPictureUrl,
}: ProfilePictureUploaderProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [profilePicture, setProfilePicture] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const supabase = createClient()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setProfilePicture(file)
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      if (!profilePicture) {
        setError("Please select a profile picture")
        return
      }

      const fileExt = profilePicture.name.split(".").pop()
      const filePath = `${beneficiaryId}/profile.${fileExt}`

      const { error: uploadError } = await supabase.storage
        .from("profiles")
        .upload(filePath, profilePicture, {
          upsert: true,
        })

      if (uploadError) {
        throw uploadError
      }

      const { data: { publicUrl } } = supabase.storage
        .from("profiles")
        .getPublicUrl(filePath)

      await supabase
        .from("profiles")
        .update({ profile_picture_url: publicUrl })
        .eq("id", beneficiaryId)

      // Reset form state
      setPreviewUrl(null)
      setProfilePicture(null)
      
    } catch (err) {
      setError("An unexpected error occurred while uploading the profile picture")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Current Profile Picture */}
      {currentPictureUrl && (
        <div>
          <h3 className="text-sm font-medium mb-2">Current Profile Picture</h3>
          <div className="relative h-32 w-32 mx-auto rounded-full overflow-hidden">
            <Image
              src={currentPictureUrl}
              alt="Current profile picture"
              fill
              className="object-cover"
            />
          </div>
        </div>
      )}

      {/* Preview */}
      {previewUrl && (
        <div>
          <h3 className="text-sm font-medium mb-2">Preview</h3>
          <div className="relative h-32 w-32 mx-auto rounded-full overflow-hidden">
            <Image
              src={previewUrl}
              alt="Profile preview"
              fill
              className="object-cover"
            />
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-4 text-sm text-red-700 bg-red-100 rounded-lg">
            {error}
          </div>
        )}

        <div>
          <Input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="cursor-pointer"
          />
          <p className="mt-1 text-xs text-gray-500">
            Select a new profile picture
          </p>
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={!profilePicture || loading}
        >
          {loading ? "Uploading..." : "Update Profile Picture"}
        </Button>
      </form>
    </div>
  )
}