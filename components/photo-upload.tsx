'use client'

import { Camera } from 'lucide-react'
import { useEffect, useState } from 'react'

interface Props {
  setPhoto: (file: File | null) => void
}

export default function PhotoUpload({
  setPhoto,
}: Props) {
  const [preview, setPreview] = useState('')

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0]

    if (!file) return

    setPhoto(file)

    const imageUrl = URL.createObjectURL(file)

    setPreview(imageUrl)
  }

  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview)
      }
    }
  }, [preview])

  return (
    <label className="border-2 border-dashed border-zinc-700 rounded-2xl overflow-hidden flex flex-col items-center justify-center text-zinc-400 cursor-pointer hover:border-green-500 transition min-h-[220px]">
      {preview ? (
        <img
          src={preview}
          alt="Preview"
          className="w-full h-64 object-cover rounded-2xl"
        />
      ) : (
        <div className="flex flex-col items-center justify-center p-8">
          <Camera size={40} />

          <p className="mt-3 text-sm">
            Klik untuk upload foto
          </p>
        </div>
      )}

      <input
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleChange}
      />
    </label>
  )
}