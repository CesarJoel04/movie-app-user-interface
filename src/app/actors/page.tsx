"use client"

import Link from "next/link"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import Footer from "../mycomponents/footer"

interface Actor {
  id: number
  firstName: string
  lastName: string
  dateOfBirth: string
}

const ACTORS_API_URL = "http://localhost:8080/api/actors"

function formatDate(dateString: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(dateString))
}

function getFullName(person: Actor) {
  return `${person.firstName} ${person.lastName}`
}

export default function ActorsPage() {
  const queryClient = useQueryClient()
  const {
    data: actors = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["actors"],
    queryFn: async () => {
      const response = await fetch(ACTORS_API_URL)

      if (!response.ok) {
        throw new Error("Unable to load actors.")
      }

      return response.json() as Promise<Actor[]>
    },
  })

  async function handleDelete(id: number, name: string) {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${name}?\n\nThis action cannot be undone.`
    )

    if (!confirmed) return

    try {
      const response = await fetch(`http://localhost:8080/api/actors/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error()
      }

      await queryClient.invalidateQueries({ queryKey: ["actors"] })
    } catch {
      alert("Unable to delete actor.")
    }
  }

  return (
    <main className="relative mb-20 min-h-screen bg-slate-950 px-4 py-8 text-slate-100 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(96,165,250,0.16),transparent_32%),radial-gradient(circle_at_top_right,rgba(14,165,233,0.12),transparent_28%),linear-gradient(180deg,rgba(8,15,35,1)_0%,rgba(2,6,23,1)_100%)]" />
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <h1 className="text-4xl font-semibold tracking-tight text-white">Actors</h1>
          </div>

          <Link
            href="/actors/add"
            className="inline-flex items-center justify-center rounded-full bg-sky-50 px-5 py-3 text-md font-medium text-slate-950 transition hover:bg-sky-800"
          >
            Add Actor
          </Link>
        </div>

        {isLoading ? (
          <p className="rounded-2xl border border-sky-400/15 bg-sky-400/10 px-5 py-4 text-sky-100 shadow-sm backdrop-blur">
            Loading actors...
          </p>
        ) : isError ? (
          <p className="rounded-2xl border border-rose-500/30 bg-rose-500/10 px-5 py-4 text-rose-200">
            Unable to load actors right now.
          </p>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {actors.map((actor) => (
              <article
                key={actor.id}
                className="group overflow-hidden rounded-[1.75rem] border border-sky-400/10 bg-slate-950/85 text-slate-100 shadow-[0_20px_60px_rgba(2,6,23,0.35)] backdrop-blur transition duration-300 hover:-translate-y-1 hover:border-sky-300/20 hover:bg-slate-900/85 hover:shadow-[0_24px_70px_rgba(2,6,23,0.5)]"
              >
                <div className="space-y-4 p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-2">
                      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">#{actor.id}</p>
                      <h2 className="text-2xl font-semibold tracking-tight text-white transition group-hover:text-slate-200">
                        {getFullName(actor)}
                      </h2>
                    </div>

                    <span className="rounded-full bg-sky-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-sky-100">
                      Actor
                    </span>
                  </div>

                  <dl className="grid gap-4 rounded-2xl border border-sky-400/10 bg-slate-900/70 p-4 text-sm text-slate-200">
                    <div className="flex items-center justify-between gap-4">
                      <dt className="font-medium text-slate-400">Date of Birth</dt>
                      <dd className="font-medium text-slate-100">
                        {formatDate(actor.dateOfBirth)}
                      </dd>
                    </div>
                  </dl>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <button
                      onClick={() => handleDelete(actor.id, getFullName(actor))}
                      className="inline-flex items-center justify-center rounded-full border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm font-medium text-rose-100 transition hover:bg-rose-500/20"
                    >
                      Delete
                    </button>

                    <Link
                      href={`/actors/edit/${actor.id}`}
                      className="inline-flex items-center justify-center rounded-full bg-sky-300 px-4 py-3 text-sm font-medium text-slate-950 transition hover:bg-sky-200"
                    >
                      Edit Actor
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        <Footer />
      </div>
    </main>
  )
}