'use client'

import { useState } from 'react'

import { useRouter } from 'next/navigation'

import Swal from 'sweetalert2'

import { supabase } from '@/lib/supabase'

export default function UpdatePasswordPage() {
  const router = useRouter()

  const [password, setPassword] =
    useState('')

  const [loading, setLoading] =
    useState(false)

  const handleUpdate = async () => {
    if (!password) return

    setLoading(true)

    const { error } =
      await supabase.auth.updateUser({
        password,
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
      title: 'Password berhasil diubah',
      background: '#18181b',
      color: '#fff',
      confirmButtonColor: '#16a34a',
    })

    router.push('/login')
  }

  return (
    <main className="min-h-screen bg-zinc-950 flex items-center justify-center p-4 text-white">
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
        <h1 className="text-3xl font-bold mb-6">
          Password Baru
        </h1>

        <div className="space-y-4">
          <input
            type="password"
            placeholder="Password baru"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl p-4 outline-none"
          />

          <button
            onClick={handleUpdate}
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-500 transition rounded-2xl p-4 font-semibold"
          >
            {loading
              ? 'Menyimpan...'
              : 'Update Password'}
          </button>
        </div>
      </div>
    </main>
  )
}