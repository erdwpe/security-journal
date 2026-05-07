'use client'

import { useEffect, useState } from 'react'
import ProtectedLayout from '@/app/protected-layout'
import Sidebar from '@/components/sidebar'
import MobileNavbar from '@/components/mobile-navbar'

import { supabase } from '@/lib/supabase'

export default function DashboardPage() {
  const [totalJurnal, setTotalJurnal] =
    useState(0)

  const [totalFoto, setTotalFoto] =
    useState(0)

  const [loading, setLoading] = useState(true)

  const getShift = () => {
    const hour = new Date().getHours()

    if (hour >= 6 && hour < 18) {
      return 'Pagi ☀️'
    }

    return 'Malam 🌙'
  }

  useEffect(() => {
    fetchDashboard()
  }, [])

  const fetchDashboard = async () => {
    const {
        data: { session },
      } = await supabase.auth.getSession()
    const { data, error } = await supabase
      .from('journals')
      .select('*')
      .eq('user_id', session?.user.id)

    if (!error && data) {
      setTotalJurnal(data.length)

      const totalImages = data.filter(
        (item) => item.photo_url
      ).length

      setTotalFoto(totalImages)
    }

    setLoading(false)
  }

  return (
    <ProtectedLayout>
    <main className="flex min-h-screen bg-zinc-950 text-white">
      <Sidebar />

      <section className="flex-1 p-4 md:p-8 pb-24">
        <div className="mb-8">
          <h1 className="text-4xl font-bold">
            Shift Aktif: {getShift()}
          </h1>

          <p className="text-zinc-400 mt-2">
            Laporan patroli tiap 2 jam.
          </p>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
              <p className="text-zinc-400">
                Total Jurnal
              </p>

              <h2 className="text-5xl font-bold mt-3">
                {totalJurnal}
              </h2>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
              <p className="text-zinc-400">
                Foto Upload
              </p>

              <h2 className="text-5xl font-bold mt-3">
                {totalFoto}
              </h2>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
              <p className="text-zinc-400">
                Shift
              </p>

              <h2 className="text-5xl font-bold mt-3">
                {getShift()}
              </h2>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
              <p className="text-zinc-400">
                Status
              </p>

              <h2 className="text-5xl font-bold mt-3 text-green-500">
                Aman
              </h2>
            </div>
          </div>
        )}
      </section>

      <MobileNavbar />
      </main>
</ProtectedLayout>
)
}