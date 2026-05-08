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

  const [loading, setLoading] =
    useState(true)

  const [currentShift, setCurrentShift] =
    useState('')

  const [totalKerja, setTotalKerja] =
    useState(0)

  const [currentTime, setCurrentTime] =
    useState('')

  useEffect(() => {
    fetchDashboard()
    fetchShift()

    const interval = setInterval(() => {
      const now = new Date()

      setCurrentTime(
        now.toLocaleString('id-ID', {
          timeZone: 'Asia/Jakarta',
          weekday: 'long',
          day: 'numeric',
          month: 'long',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        })
      )
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const fetchShift = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession()
  
    if (!session) return
  
    const { data } = await supabase
      .from('profiles')
      .select(
        'shift_start_date, shift_type'
      )
      .eq('id', session.user.id)
      .single()
  
    if (!data?.shift_start_date) return
  
    let pattern = [
      'Pagi ☀️',
      'Pagi ☀️',
      'Malam 🌙',
      'Malam 🌙',
      'Off 😴',
      'Off 😴',
    ]
  
    // MALAM PERTAMA
    if (data.shift_type === 'Malam') {
      pattern = [
        'Malam 🌙',
        'Off 😴',
        'Off 😴',
        'Pagi ☀️',
        'Pagi ☀️',
        'Malam 🌙',
      ]
    }
  
    // OFF PERTAMA
    if (data.shift_type === 'Off') {
      pattern = [
        'Off 😴',
        'Pagi ☀️',
        'Pagi ☀️',
        'Malam 🌙',
        'Malam 🌙',
        'Off 😴',
      ]
    }
  
    const startDate = new Date(
      data.shift_start_date
    )
  
    const today = new Date()
  
    const diffDays = Math.floor(
      (today.getTime() -
        startDate.getTime()) /
        (1000 * 60 * 60 * 24)
    )
  
    const shift =
      pattern[
        ((diffDays % 6) + 6) % 6
      ]
  
    setCurrentShift(shift)
  
    // TOTAL HARI KERJA BULAN INI
    let kerja = 0

    const firstDayMonth = new Date(
      today.getFullYear(),
      today.getMonth(),
      1
    )
    
    // mulai hitung dari tanggal start shift
    const startLoop =
      startDate > firstDayMonth
        ? startDate
        : firstDayMonth
    
    const totalDays = Math.floor(
      (today.getTime() -
        startLoop.getTime()) /
        (1000 * 60 * 60 * 24)
    )
  
    for (let i = 0; i <= totalDays; i++) {
      const currentDate = new Date(
        startLoop
      )
  
      currentDate.setDate(
        firstDayMonth.getDate() + i
      )
  
      const diff = Math.floor(
        (currentDate.getTime() -
          startDate.getTime()) /
          (1000 * 60 * 60 * 24)
      )
  
      const idx =
        ((diff % 6) + 6) % 6
  
      const currentShift =
        pattern[idx]
  
      if (
        currentShift ===
          'Pagi ☀️' ||
        currentShift ===
          'Malam 🌙'
      ) {
        kerja++
      }
    }
  
    setTotalKerja(kerja)
  }

const fetchDashboard = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession()

    const { data, error } =
      await supabase
        .from('journals')
        .select('*')
        .eq(
          'user_id',
          session?.user.id
        )

    if (!error && data) {
      setTotalJurnal(data.length)

      const totalImages =
        data.filter(
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
          
          {/* HEADER */}
          <div className="mb-8">
            <h2 className="text-zinc-400 text-lg">
              Halo, Angga 👋
            </h2>

            <h1 className="text-4xl font-bold mt-2">
              Shift Aktif:{' '}
              {currentShift || '-'}
            </h1>

            <p className="text-zinc-500 mt-3">
              {currentTime}
            </p>
          </div>

          {loading ? (
            <p>Loading...</p>
          ) : (
            <>
              {/* STATS */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">

                <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5">
                  <p className="text-zinc-400 text-sm">
                    Total Jurnal
                  </p>

                  <h2 className="text-4xl font-bold mt-3">
                    {totalJurnal}
                  </h2>
                </div>

                <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5">
                  <p className="text-zinc-400 text-sm">
                    Foto Upload
                  </p>

                  <h2 className="text-4xl font-bold mt-3">
                    {totalFoto}
                  </h2>
                </div>

                <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5">
                  <p className="text-zinc-400 text-sm">
                    Shift
                  </p>

                  <h2 className="text-4xl font-bold mt-3">
                    {currentShift}
                  </h2>
                </div>

                <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5">
                  <p className="text-zinc-400 text-sm">
                    Hari Kerja
                  </p>

                  <h2 className="text-4xl font-bold mt-3">
                    {totalKerja}
                  </h2>

                  <p className="text-zinc-500 text-sm mt-2">
                    Bulan ini
                  </p>
                </div>

                <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5">
                  <p className="text-zinc-400 text-sm">
                    Status
                  </p>

                  <h2 className="text-4xl font-bold mt-3 text-green-500">
                    Aman
                  </h2>
                </div>

              </div>
            </>
          )}
        </section>

        <MobileNavbar />
      </main>
    </ProtectedLayout>
  )
}