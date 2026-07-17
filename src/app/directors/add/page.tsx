"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useQueryClient } from "@tanstack/react-query"
import Footer from "../../mycomponents/footer"

const API_URL = "http://localhost:8080/api/directors"

export default function AddDirectorPage() {
  const router = useRouter()
  const queryClient = useQueryClient()

  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [dateOfBirth, setDateOfBirth] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsSaving(true)
    setError("")

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName,
          lastName,
          dateOfBirth,
        }),
      })

      if (!response.ok) {
        throw new Error("Unable to add director.")
      }

      await queryClient.invalidateQueries({ queryKey: ["directors"] })

      router.push("/directors")
    } catch {
      setError("Unable to add director.")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <main className="relative mb-20 min-h-screen bg-slate-950 px-4 py-8 text-slate-100 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(96,165,250,0.16),transparent_32%),radial-gradient(circle_at_top_right,rgba(14,165,233,0.12),transparent_28%),linear-gradient(180deg,rgba(8,15,35,1)_0%,rgba(2,6,23,1)_100%)]" />

      <div className="mx-auto flex w-full max-w-4xl flex-col gap-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-semibold tracking-tight text-white">Add Director</h1>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-5 rounded-[2rem] border border-white/10 bg-white/5 p-5 shadow-2xl shadow-slate-950/30 backdrop-blur sm:p-6">
          {error && (
            <p className="rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-rose-200">
              {error}
            </p>
          )}

          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-200">First Name</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-sky-400/40"
                placeholder="Christopher"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-200">Last Name</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-sky-400/40"
                placeholder="Nolan"
                required
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-slate-200">Date of Birth</label>
              <input
                type="date"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-sky-400/40"
                required
              />
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => router.push("/directors")}
              className="inline-flex items-center justify-center rounded-full border border-white/10 px-5 py-3 font-medium text-slate-200 transition hover:bg-white/10"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center justify-center rounded-full bg-sky-300 px-5 py-3 font-medium text-slate-950 transition hover:bg-sky-200 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSaving ? "Saving..." : "Save Director"}
            </button>
          </div>
        </form>

        <Footer />
      </div>
    </main>
  )
}