'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Swal from 'sweetalert2'
import imageCompression from 'browser-image-compression'

import Sidebar from '@/components/sidebar'
import MobileNavbar from '@/components/mobile-navbar'
import JournalForm from '@/components/journal-form'
import PhotoUpload from '@/components/photo-upload'
import ProtectedLayout from '@/app/protected-layout'
import { supabase } from '@/lib/supabase'

export default function CreateJournalPage() {
  const router = useRouter()

  const [kegiatan, setKegiatan] =
    useState('Patroli Aman')

  const [laporan, setLaporan] = useState('')

  const [kendaraan, setKendaraan] =
    useState('')

  const [photo, setPhoto] = useState<File | null>(
    null
  )

  const [loading, setLoading] = useState(false)

  const getShift = () => {
    const hour = new Date().getHours()

    if (hour >= 6 && hour < 18) {
      return 'Pagi'
    }

    return 'Malam'
  }

  const handleSave = async () => {
    
    try {
      setLoading(true)

      let photoUrl = ''

      if (photo) {
        const compressed =
          await imageCompression(photo, {
            maxSizeMB: 0.3,
            maxWidthOrHeight: 1280,
          })

        const fileName = `${Date.now()}.jpg`

        const { error: uploadError } =
          await supabase.storage
            .from('journal-photo')
            .upload(fileName, compressed)

        if (uploadError) {
            Swal.fire({
                icon: 'error',
                title: 'Upload gagal',
                text: uploadError.message,
                background: '#18181b',
                color: '#fff',
                confirmButtonColor: '#dc2626',
              })
                        return
        }

        const { data } = supabase.storage
          .from('journal-photo')
          .getPublicUrl(fileName)

        photoUrl = data.publicUrl
      }
      const {
        data: { session },
      } = await supabase.auth.getSession()
      const { error } = await supabase
      .from('journals')
      .insert({
        kegiatan,
        laporan,
        kendaraan,
        status: 'aman',
        shift: getShift(),
        lokasi: 'Depan/Belakang',
        photo_url: photoUrl,
        user_id: session?.user.id,
      
        created_at: new Date().toLocaleString(
          'sv-SE',
          {
            timeZone: 'Asia/Jakarta',
          }
        ),
      })
      if (error) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: error.message,
            background: '#18181b',
            color: '#fff',
            confirmButtonColor: '#dc2626',
          })
        return
      }

      Swal.fire({
        icon: 'success',
        title: 'Berhasil',
        text: 'Jurnal berhasil disimpan',
        background: '#18181b',
        color: '#fff',
        confirmButtonColor: '#16a34a',
      })
      router.push('/journal/history')
    } catch (err) {
      console.log(err)
      Swal.fire({
        icon: 'error',
        title: 'Terjadi Kesalahan',
        text: 'Coba lagi nanti',
        background: '#18181b',
        color: '#fff',
        confirmButtonColor: '#dc2626',
      })
        } finally {
      setLoading(false)
    }
  }

  return (
    <ProtectedLayout>
    <main className="flex min-h-screen bg-zinc-950 text-white">
      <Sidebar />

      <section className="flex-1 p-4 md:p-8 pb-24">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">
            Tambah Jurnal
          </h1>

          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 space-y-6">
            <JournalForm
              kegiatan={kegiatan}
              setKegiatan={setKegiatan}
              laporan={laporan}
              setLaporan={setLaporan}
              kendaraan={kendaraan}
              setKendaraan={setKendaraan}
            />

            <PhotoUpload setPhoto={setPhoto} />

            <button
              id="save-journal"
              onClick={handleSave}
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-500 transition rounded-2xl p-4 font-semibold"
            >
              {loading
                ? 'Menyimpan...'
                : 'Simpan Jurnal'}
            </button>
          </div>
        </div>
      </section>

      <MobileNavbar />
    </main>
    </ProtectedLayout>
  )
}