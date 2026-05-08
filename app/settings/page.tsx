'use client'

import { useEffect, useState } from 'react'

import Sidebar from '@/components/sidebar'
import MobileNavbar from '@/components/mobile-navbar'
import ProtectedLayout from '@/app/protected-layout'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

import Swal from 'sweetalert2'

export default function SettingsPage() {
  const router = useRouter()

  const [loading, setLoading] = useState(false)

  const [email, setEmail] = useState('')
  const [fullName, setFullName] = useState('')
  const [username, setUsername] = useState('')
  const [avatar, setAvatar] = useState('')

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) return

    setEmail(session.user.email || '')

    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single()

    if (data) {
      setFullName(data.full_name || '')
      setUsername(data.username || '')
      setAvatar(data.avatar_url || '')
    }
  }

  const handleUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0]

    if (!file) return

    const filename = `${Date.now()}-${file.name}`

    const { error } = await supabase.storage
      .from('avatars')
      .upload(filename, file)

    if (error) {
      Swal.fire({
        icon: 'error',
        title: 'Upload gagal',
        text: error.message,
        background: '#18181b',
        color: '#fff',
      })

      return
    }

    const {
      data: { publicUrl },
    } = supabase.storage
      .from('avatars')
      .getPublicUrl(filename)

    setAvatar(publicUrl)

    Swal.fire({
      icon: 'success',
      title: 'Avatar berhasil diupload',
      background: '#18181b',
      color: '#fff',
      confirmButtonColor: '#16a34a',
    })
  }

  const handleSave = async () => {
    setLoading(true)

    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) return

    const { error } = await supabase
      .from('profiles')
      .upsert({
        id: session.user.id,
        full_name: fullName,
        username,
        avatar_url: avatar,
        email: email,
      })

    setLoading(false)

    if (error) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: error.message,
        background: '#18181b',
        color: '#fff',
      })

      return
    }

    Swal.fire({
      icon: 'success',
      title: 'Berhasil',
      text: 'Profile berhasil disimpan',
      background: '#18181b',
      color: '#fff',
      confirmButtonColor: '#16a34a',
    })
  }

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: 'Logout?',
      text: 'Yakin ingin keluar?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#3f3f46',
      confirmButtonText: 'Logout',
      cancelButtonText: 'Batal',
      background: '#18181b',
      color: '#fff',
    })

    if (!result.isConfirmed) return

    await supabase.auth.signOut()

    router.push('/login')
  }

  return (
    <ProtectedLayout>
    <main className="flex min-h-screen bg-zinc-950 text-white ">
      <Sidebar />

      <section className="flex-1 p-4 md:p-8 pb-24">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">
            Pengaturan Akun
          </h1>

          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
            <div className="flex flex-col items-center mb-8">
              <label className="cursor-pointer">
                {avatar ? (
                  <img
                    src={avatar}
                    alt="Avatar"
                    className="w-28 h-28 rounded-full object-cover border-4 border-zinc-700"
                  />
                ) : (
                  <div className="w-28 h-28 rounded-full bg-zinc-800 flex items-center justify-center text-3xl font-bold">
                    {fullName?.charAt(0) || 'U'}
                  </div>
                )}

                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleUpload}
                />
              </label>

              <p className="text-zinc-400 mt-3">
                Klik foto untuk upload avatar
              </p>
            </div>

            <div className="space-y-4">
              <input
                type="text"
                placeholder="Nama lengkap"
                value={fullName}
                onChange={(e) =>
                  setFullName(e.target.value)
                }
                className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl p-4 outline-none"
              />

              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) =>
                  setUsername(e.target.value)
                }
                className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl p-4 outline-none"
              />

              <input
                type="email"
                value={email}
                disabled
                className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl p-4 text-zinc-400"
              />

              <button
                onClick={handleSave}
                disabled={loading}
                className="w-full bg-green-600 hover:bg-green-500 transition rounded-2xl p-4 font-semibold"
              >
                {loading
                  ? 'Menyimpan...'
                  : 'Simpan Profile'}
              </button>

              <button
                onClick={handleLogout}
                className="w-full bg-red-600 hover:bg-red-500 transition rounded-2xl p-4 font-semibold"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </section>

      <MobileNavbar />
    </main>
    </ProtectedLayout>
  )
}