'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Swal from 'sweetalert2'
import {
  LayoutDashboard,
  FileText,
  History,
  Settings,
  LogOut,
} from 'lucide-react'

import { supabase } from '@/lib/supabase'

export default function Sidebar() {
  const router = useRouter()

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
    <aside className="hidden md:flex w-64 min-h-screen bg-zinc-900 border-r border-zinc-800 flex-col justify-between p-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-green-500">
          Security Journal
        </h1>
      </div>

      <nav className="space-y-2 flex-1">
        <Link
          href="/dashboard"
          className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-zinc-800"
        >
          <LayoutDashboard size={18} />
          Dashboard
        </Link>

        <Link
          href="/journal/new"
          className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-zinc-800"
        >
          <FileText size={18} />
          Jurnal
        </Link>

        <Link
          href="/journal/history"
          className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-zinc-800"
        >
          <History size={18} />
          Riwayat
        </Link>
      </nav>
      <Link
  href="/settings"
  className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-zinc-800"
>
  <Settings size={18} />
  Pengaturan
</Link>
      <button
        onClick={handleLogout}
        className="flex items-center gap-3 w-full p-3 rounded-2xl bg-red-600 hover:bg-red-500 transition"
      >
        <LogOut size={18} />
        Logout
      </button>
    </aside>
  )
}