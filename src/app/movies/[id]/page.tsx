"use client"

import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useQueryClient } from "@tanstack/react-query"
import Footer from "../../mycomponents/footer"

interface MovieDetail {
  id: number
  movieName?: string
  movieTitle?: string
  movieLength: number
  releaseDate: string
  overview: string
  trailerUrl: string
  posterPath?: string | null
  genre?: string | { id: number; genre: string }
  rating?: string | { id: number; description: string; rating: string }
  director?: {
    id: number
    firstName: string
    lastName: string
    dateOfBirth: string
  } | null
  actors?: {
    id: number
    firstName: string
    lastName: string
    dateOfBirth: string
  }[]
}

const MOVIES_API_URL = "http://localhost:8080/api/movies"
const MOVIE_ASSET_BASE_URL = "https://image.tmdb.org/t/p/w500"

function formatDate(dateString: string) {
  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(dateString))
}

function getMovieTitle(movie: MovieDetail) {
  return movie.movieName ?? movie.movieTitle ?? "Untitled movie"
}

function getGenre(movie: MovieDetail) {
  if (typeof movie.genre === "string") {
    return movie.genre
  }

  return movie.genre?.genre ?? "Unknown"
}

function getRating(movie: MovieDetail) {
  if (typeof movie.rating === "string") {
    return movie.rating
  }

  return movie.rating?.rating ?? "Unrated"
}

function getPosterUrl(posterPath?: string | null) {
  if (!posterPath) {
    return ""
  }

  if (posterPath.startsWith("http://") || posterPath.startsWith("https://")) {
    return posterPath
  }

  return `${MOVIE_ASSET_BASE_URL}${posterPath.startsWith("/") ? "" : "/"}${posterPath}`
}

export default function MovieDetailPage() {
  const params = useParams()
  const id = Array.isArray(params.id) ? params.id[0] : params.id
  const router = useRouter()
  const queryClient = useQueryClient()

  const [movie, setMovie] = useState<MovieDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    async function loadMovie() {
      try {
        setIsLoading(true)
        setError("")

        const response = await fetch(`${MOVIES_API_URL}/${id}`)

        if (!response.ok) {
          throw new Error("Unable to load movie.")
        }

        const movieData = await response.json()
        setMovie(movieData)
      } catch {
        setError("Unable to load movie details.")
      } finally {
        setIsLoading(false)
      }
    }

    if (id) {
      loadMovie()
    }
  }, [id])

  async function handleDelete() {
    if (!movie) return

    const confirmed = window.confirm(
      `Are you sure you want to delete ${getMovieTitle(movie)}?\n\nThis action cannot be undone.`
    )

    if (!confirmed) return

    try {
      setIsDeleting(true)

      const response = await fetch(`${MOVIES_API_URL}/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Unable to delete movie.")
      }

      await queryClient.invalidateQueries({ queryKey: ["movies"] })

      router.push("/movies")
    } catch {
      setError("Unable to delete movie.")
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <main className="relative mb-20 min-h-screen bg-slate-950 px-4 py-8 text-slate-100 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(96,165,250,0.16),transparent_32%),radial-gradient(circle_at_top_right,rgba(14,165,233,0.12),transparent_28%),linear-gradient(180deg,rgba(8,15,35,1)_0%,rgba(2,6,23,1)_100%)]" />

      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <h1 className="text-4xl font-semibold tracking-tight text-white">
              {movie ? getMovieTitle(movie) : "Movie"}
            </h1>
          </div>

          <Link
            href="/movies"
            className="inline-flex items-center justify-center rounded-full border border-white/10 px-5 py-3 font-medium text-slate-200 transition hover:bg-white/10"
          >
            Back to movies
          </Link>
        </div>

        {isLoading ? (
          <p className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-slate-300 backdrop-blur">
            Loading movie details...
          </p>
        ) : error ? (
          <p className="rounded-2xl border border-rose-500/30 bg-rose-500/10 px-5 py-4 text-rose-200">
            {error}
          </p>
        ) : movie ? (
          <div className="grid gap-8 rounded-[2rem] border border-white/10 bg-white/5 p-5 shadow-2xl shadow-slate-950/30 backdrop-blur lg:grid-cols-[0.85fr_1.15fr] lg:p-6">
            <aside className="space-y-4">
              <div className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-slate-950/70 shadow-[0_18px_50px_rgba(2,6,23,0.32)]">
                <div className="relative aspect-2/3">
                  {movie.posterPath ? (
                    <Image
                      src={getPosterUrl(movie.posterPath)}
                      alt={`${getMovieTitle(movie)} poster`}
                      fill
                      className="object-cover"
                      sizes="(min-width: 1024px) 30vw, 100vw"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-[radial-gradient(circle_at_top,rgba(148,163,184,0.2),transparent_55%),linear-gradient(180deg,rgba(15,23,42,1)_0%,rgba(2,6,23,1)_100%)] px-6 text-center text-sm uppercase tracking-[0.18em] text-slate-400">
                      Poster unavailable
                    </div>
                  )}
                </div>
              </div>

              <dl className="grid gap-4 rounded-3xl border border-white/10 bg-slate-950/60 p-5 text-sm text-slate-200">
                <div className="flex items-center justify-between gap-4">
                  <dt className="font-medium text-slate-400">Release Date</dt>
                  <dd className="font-medium text-slate-100">{formatDate(movie.releaseDate)}</dd>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <dt className="font-medium text-slate-400">Genre</dt>
                  <dd className="font-medium text-slate-100">{getGenre(movie)}</dd>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <dt className="font-medium text-slate-400">Rating</dt>
                  <dd className="font-medium text-slate-100">{getRating(movie)}</dd>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <dt className="font-medium text-slate-400">Length</dt>
                  <dd className="font-medium text-slate-100">{movie.movieLength} minutes</dd>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <dt className="font-medium text-slate-400">Director</dt>
                  <dd className="text-right font-medium text-slate-100">
                    {movie.director ? `${movie.director.firstName} ${movie.director.lastName}` : "Unknown"}
                  </dd>
                </div>
              </dl>
            </aside>

            <section className="space-y-6">
              <div className="overflow-hidden rounded-3xl border border-white/10 bg-slate-950/70">
                <iframe
                  className="aspect-video w-full"
                  src={movie.trailerUrl}
                  title={`${getMovieTitle(movie)} trailer`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>

              <div className="space-y-3">
                <h2 className="text-lg font-semibold text-white">Overview</h2>
                <p className="text-slate-300">{movie.overview}</p>
              </div>

              <div className="space-y-3">
                <h2 className="text-lg font-semibold text-white">Actors</h2>
                <div className="flex flex-wrap gap-2">
                  {movie.actors?.length ? (
                    movie.actors.map((actor) => (
                      <span
                        key={actor.id}
                        className="rounded-full border border-sky-400/15 bg-sky-400/10 px-3 py-1 text-sm text-sky-100"
                      >
                        {actor.firstName} {actor.lastName}
                      </span>
                    ))
                  ) : (
                    <span className="text-slate-400">No actors listed</span>
                  )}
                </div>
              </div>

              <div className="grid gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="inline-flex w-6/12 items-center justify-center rounded-full border border-rose-500/30 bg-rose-500/10 px-5 py-3 font-medium text-rose-100 transition hover:bg-rose-500/20 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isDeleting ? "Deleting..." : "Delete movie"}
                </button>
              </div>
            </section>
          </div>
        ) : null}

        <Footer />
      </div>
    </main>
  )
}
