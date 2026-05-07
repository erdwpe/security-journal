'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Home,
  History,
  PlusSquare,
  User,
} from 'lucide-react'

export default function MobileNavbar() {
  const pathname = usePathname()

  const menus = [
    {
      name: 'Home',
      icon: Home,
      href: '/dashboard',
    },
    {
      name: 'Riwayat',
      icon: History,
      href: '/journal/history',
    },
    {
      name: 'Tambah',
      icon: PlusSquare,
      href: '/journal/new',
      primary: true,
    },
    {
      name: 'Akun',
      icon: User,
      href: '/settings',
    },
  ]

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-zinc-900 border-t border-zinc-800 px-4 py-3 flex items-center justify-around z-50">
      {menus.map((item) => {
        const Icon = item.icon
        const active =
          pathname === item.href

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center text-xs transition ${
              item.primary
                ? 'bg-green-600 text-white p-4 rounded-full -mt-10 shadow-lg'
                : active
                ? 'text-green-500'
                : 'text-zinc-400'
            }`}
          >
            <Icon size={20} />
            {!item.primary && (
              <span className="mt-1">
                {item.name}
              </span>
            )}
          </Link>
        )
      })}
    </nav>
  )
}