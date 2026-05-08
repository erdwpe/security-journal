'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import {
  Menu,
  MenuButton,
  MenuItems,
  MenuItem,
} from '@headlessui/react'

import {
  Settings,
  LogOut,
} from 'lucide-react'

import Swal from 'sweetalert2'

import { supabase } from '@/lib/supabase'

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()

  const [avatar, setAvatar] =
    useState('')

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) return

    const { data } = await supabase
      .from('profiles')
      .select('avatar_url')
      .eq('id', session.user.id)
      .single()

    if (data?.avatar_url) {
      setAvatar(data.avatar_url)
    }
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
    <div className="relative">

      {/* TOP RIGHT MENU */}
      <div className="hidden md:block fixed top-5 right-5 z-50">
                <Menu as="div" className="relative">  
          <MenuButton className="w-11 h-11 rounded-full overflow-hidden border border-zinc-700 bg-zinc-800 hover:scale-105 transition">
            
            {avatar ? (
              <img
                src={avatar}
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white">
                U
              </div>
            )}

          </MenuButton>

          <MenuItems className="absolute right-0 mt-3 w-52 bg-zinc-900 border border-zinc-800 rounded-2xl p-2 shadow-2xl">

            <MenuItem>
              {({ active }) => (
                <Link
                  href="/settings"
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition ${
                    active
                      ? 'bg-zinc-800'
                      : ''
                  }`}
                >
                  <Settings size={18} />
                  Pengaturan
                </Link>
              )}
            </MenuItem>

            <MenuItem>
              {({ active }) => (
                <button
                  onClick={handleLogout}
                  className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl transition text-left ${
                    active
                      ? 'bg-red-600'
                      : ''
                  }`}
                >
                  <LogOut size={18} />
                  Logout
                </button>
              )}
            </MenuItem>

          </MenuItems>
        </Menu>
      </div>

      {children}
    </div>
  )
}