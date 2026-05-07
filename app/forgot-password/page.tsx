'use client'

import { useState } from 'react'

import Link from 'next/link'

import Swal from 'sweetalert2'

import { supabase } from '@/lib/supabase'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] =
    useState(false)

  const handleReset = async () => {
    if (!email) return

    setLoading(true)

    const { error } =
      await supabase.auth.resetPasswordForEmail(
        email,
        {
          redirectTo:
            'http://localhost:3000/update-password',
        }
      )

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
      title: 'Email terkirim',
      text: 'Cek email untuk reset password',
      background: '#18181b',
      color: '#fff',
      confirmButtonColor: '#16a34a',
    })
  }

  return (
    <main className="min-h-screen bg-zinc-950 flex items-center justify-center p-4 text-white">
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
        <h1 className="text-3xl font-bold mb-2">
          Reset Password
        </h1>

        <p className="text-zinc-400 mb-6">
          Masukkan email akun anda.
        </p>

        <div className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl p-4 outline-none"
          />

          <button
            onClick={handleReset}
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-500 transition rounded-2xl p-4 font-semibold"
          >
            {loading
              ? 'Mengirim...'
              : 'Kirim Link Reset'}
          </button>

          <Link
            href="/login"
            className="block text-center text-zinc-400 hover:text-white"
          >
            Kembali ke login
          </Link>
        </div>
      </div>
    </main>
  )
}