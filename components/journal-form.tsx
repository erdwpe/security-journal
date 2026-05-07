'use client'

import { useState } from 'react'

interface Props {
  kegiatan: string
  setKegiatan: (value: string) => void

  laporan: string
  setLaporan: (value: string) => void

  kendaraan: string
  setKendaraan: (value: string) => void
}

export default function JournalForm({
  kegiatan,
  setKegiatan,
  laporan,
  setLaporan,
  kendaraan,
  setKendaraan,
}: Props) {
  return (
    <div className="space-y-4">
      <select
        value={kegiatan}
        onChange={(e) => setKegiatan(e.target.value)}
        className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-4 outline-none"
      >
        <option value="Patroli Aman">
          Patroli Aman
        </option>

        <option value="Mobil Masuk">
          Mobil Masuk
        </option>

        <option value="Mobil Keluar">
          Mobil Keluar
        </option>

        <option value="Kendala">
          Kendala
        </option>
      </select>

      <textarea
        value={laporan}
        onChange={(e) => setLaporan(e.target.value)}
        onKeyDown={(e) => {
            if (
              e.key === 'Enter' &&
              e.ctrlKey
            ) {
              const button =
                document.querySelector(
                  '#save-journal'
                ) as HTMLButtonElement
          
              button?.click()
            }
          }}
        placeholder="Tulis laporan..."
        className="w-full h-40 bg-zinc-900 border border-zinc-800 rounded-2xl p-4 outline-none"
      />

      <input
        type="text"
        value={kendaraan}
        onChange={(e) => setKendaraan(e.target.value)}
        placeholder="Nomor kendaraan (optional)"
        className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-4 outline-none"
      />
    </div>
  )
}