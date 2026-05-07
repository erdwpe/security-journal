'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Swal from 'sweetalert2'
import Link from 'next/link'

export default function LoginPage() {
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    setLoading(true)
  
    let loginEmail = email
  
    // kalau input bukan email
    if (!email.includes('@')) {
        const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('username', email)
        .maybeSingle()
      
      if (error || !data) {
        setLoading(false)
      
        Swal.fire({
          icon: 'error',
          title: 'User tidak ditemukan',
          background: '#18181b',
          color: '#fff',
        })
      
        return
      }
      
      loginEmail = data.email
    }
  
    const { error } = await supabase.auth.signInWithPassword({
      email: loginEmail,
      password,
    })
  
    setLoading(false)
  
    if (error) {
      Swal.fire({
        icon: 'error',
        title: 'Login gagal',
        text: error.message,
        background: '#18181b',
        color: '#fff',
      })
  
      return
    }
  
    Swal.fire({
      icon: 'success',
      title: 'Login berhasil',
      timer: 1200,
      showConfirmButton: false,
      background: '#18181b',
      color: '#fff',
    })
  
    router.push('/dashboard')
  }

  return (
    <main className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-3xl p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-green-500">
            Security Journal
          </h1>

          <p className="text-zinc-400 mt-2">
            Login untuk melanjutkan.
          </p>
        </div>

        <div className="space-y-4">
          <input
            type="email"
            placeholder="Email atau Username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-zinc-800 rounded-2xl p-4 outline-none"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-zinc-800 rounded-2xl p-4 outline-none"
          />

<button

  onClick={handleLogin}
  disabled={loading}
  className="w-full bg-green-600 hover:bg-green-500 transition rounded-2xl p-4 font-semibold disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center"
>
  {loading ? (
    <div className="flex items-center gap-3">
      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>

      <span>Masuk...</span>
    </div>
  ) : (
    'Login'
  )}

</button>
<Link
  href="/forgot-password"
  className="block text-center text-zinc-400 hover:text-white mt-4"
>
  Lupa password?
</Link>
        </div>
      </div>
    </main>
  )
}