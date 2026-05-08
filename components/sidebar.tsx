'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Swal from 'sweetalert2'

import {
  Menu,
  MenuButton,
  MenuItems,
  MenuItem,
} from '@headlessui/react'

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
    <aside className="hidden md:flex w-64 min-h-screen bg-zinc-900 border-r border-zinc-800 flex-col p-4">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-10">
        <h1 className="text-2xl font-bold text-green-500">
          Security Journal
        </h1>

        {/* DROPDOWN */}
      </div>

      {/* MENU */}
      <nav className="space-y-2">
        <Link
          href="/dashboard"
          className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-zinc-800 transition"
        >
          <LayoutDashboard size={18} />
          Dashboard
        </Link>

        <Link
          href="/journal/new"
          className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-zinc-800 transition"
        >
          <FileText size={18} />
          Jurnal
        </Link>

        <Link
          href="/journal/history"
          className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-zinc-800 transition"
        >
          <History size={18} />
          Riwayat
        </Link>
      </nav>
    </aside>
  )
}