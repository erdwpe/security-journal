'use client'

import { useEffect, useState } from 'react'
import Swal from 'sweetalert2'
import { Trash2 } from 'lucide-react'

import ProtectedLayout from '@/app/protected-layout'

import Sidebar from '@/components/sidebar'
import MobileNavbar from '@/components/mobile-navbar'

import { supabase } from '@/lib/supabase'

interface Journal {
  id: string
  kegiatan: string
  shift: string
  catatan: string
  created_at: string
  photo_url: string
  kendaraan: string
}

export default function HistoryPage() {
  const [journals, setJournals] = useState<
    Journal[]
  >([])

  const [filterShift, setFilterShift] =
    useState('Semua')

  const [loading, setLoading] =
    useState(true)

  useEffect(() => {
    fetchJournals()
  }, [])

  const fetchJournals = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession()

    const { data, error } = await supabase
      .from('journals')
      .select('*')
      .eq('user_id', session?.user.id)
      .order('created_at', {
        ascending: false,
      })

    if (!error && data) {
      setJournals(data)
    }

    setLoading(false)
  }

  const handleDelete = async (
    id: string,
    photoUrl: string
  ) => {
    const result = await Swal.fire({
      title: 'Hapus jurnal?',
      text: 'Data tidak bisa dikembalikan',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#3f3f46',
      confirmButtonText: 'Hapus',
      cancelButtonText: 'Batal',
      background: '#18181b',
      color: '#fff',
    })

    if (!result.isConfirmed) return

    try {
      if (photoUrl) {
        const fileName = photoUrl
          .split('/')
          .pop()

        if (fileName) {
          await supabase.storage
            .from('journal-photo')
            .remove([fileName])
        }
      }

      const { error } = await supabase
        .from('journals')
        .delete()
        .eq('id', id)

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
        text: 'Jurnal berhasil dihapus',
        background: '#18181b',
        color: '#fff',
        confirmButtonColor: '#16a34a',
      })

      fetchJournals()
    } catch (err) {
      console.log(err)
    }
  }

  const filteredJournals =
    filterShift === 'Semua'
      ? journals
      : journals.filter(
          (item) =>
            item.shift === filterShift
        )

  const groupedJournals =
    filteredJournals.reduce(
      (acc, item) => {
        const date = new Date(
          item.created_at
        ).toLocaleDateString('id-ID', {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })

        if (!acc[date]) {
          acc[date] = []
        }

        acc[date].push(item)

        return acc
      },
      {} as Record<string, Journal[]>
    )

  return (
    <ProtectedLayout>
      <main className="flex min-h-screen bg-zinc-950 text-white">
        <Sidebar />

        <section className="flex-1 p-4 md:p-8 pb-24">
          <div className="max-w-5xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold">
                Riwayat Jurnal
              </h1>

              <p className="text-zinc-400 mt-2">
                Semua laporan patroli
                tersimpan di sini.
              </p>
            </div>

            <div className="flex gap-2 mb-6">
              <button
                onClick={() =>
                  setFilterShift('Semua')
                }
                className={`px-4 py-2 rounded-xl ${
                  filterShift === 'Semua'
                    ? 'bg-green-600'
                    : 'bg-zinc-800'
                }`}
              >
                Semua
              </button>

              <button
                onClick={() =>
                  setFilterShift('Pagi')
                }
                className={`px-4 py-2 rounded-xl ${
                  filterShift === 'Pagi'
                    ? 'bg-yellow-500 text-black'
                    : 'bg-zinc-800'
                }`}
              >
                Pagi ☀️
              </button>

              <button
                onClick={() =>
                  setFilterShift('Malam')
                }
                className={`px-4 py-2 rounded-xl ${
                  filterShift === 'Malam'
                    ? 'bg-blue-600'
                    : 'bg-zinc-800'
                }`}
              >
                Malam 🌙
              </button>
            </div>

            {loading ? (
              <p>Loading...</p>
            ) : Object.keys(groupedJournals)
                .length === 0 ? (
              <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-10 text-center text-zinc-400">
                Belum ada jurnal.
              </div>
            ) : (
              <div className="space-y-10">
                {Object.entries(
                  groupedJournals
                ).map(([date, items]) => (
                  <div key={date}>
                    <h2 className="text-2xl font-bold text-green-500 mb-4">
                      {date}
                    </h2>

                    <div className="grid gap-4">
                      {items.map((item) => (
                        <div
                          key={item.id}
                          className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden"
                        >
                          {item.photo_url && (
                            <img
                              src={
                                item.photo_url
                              }
                              alt="Foto"
                              className="w-full h-64 object-cover"
                            />
                          )}

                          <div className="p-5">
                            <div className="flex items-center justify-between mb-3">
                              <h2 className="text-xl font-semibold">
                                {
                                  item.kegiatan
                                }
                              </h2>

                              <span className="bg-green-600/20 text-green-400 px-3 py-1 rounded-full text-sm">
                                {item.shift}
                              </span>
                            </div>

                            {item.catatan && (
                              <p className="text-zinc-300 mb-2">
                                {
                                  item.catatan
                                }
                              </p>
                            )}

                            {item.kendaraan && (
                              <p className="text-zinc-400 mb-2">
                                Kendaraan:{' '}
                                {
                                  item.kendaraan
                                }
                              </p>
                            )}

                            <p className="text-zinc-500 text-sm">
                              {new Date(
                                item.created_at
                              ).toLocaleTimeString(
                                'id-ID',
                                {
                                  weekday: 'long',
                                  day: 'numeric',
                                  month: 'long',
                                  year: 'numeric',
                                  timeZone: 'Asia/Jakarta',
                                }
                              )}
                            </p>

                            <button
                              onClick={() =>
                                handleDelete(
                                  item.id,
                                  item.photo_url
                                )
                              }
                              className="mt-4 flex items-center gap-2 bg-red-600 hover:bg-red-500 transition px-4 py-2 rounded-xl text-sm"
                            >
                              <Trash2
                                size={16}
                              />
                              Hapus
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        <MobileNavbar />
      </main>
    </ProtectedLayout>
  )
}