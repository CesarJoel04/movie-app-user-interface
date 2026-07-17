"use client"

import Image from "next/image"
import Link from "next/link"
import { useQuery } from "@tanstack/react-query"
import { useQueryClient } from "@tanstack/react-query"
import Footer from "../mycomponents/footer"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface Movie {
  id: number
  movieName?: string
  movieTitle?: string
  movieLength: number
  releaseDate: string
  trailerUrl: string
  posterPath?: string | null
  director?: {
    id: number
    firstName: string
    lastName: string
    dateOfBirth: string
  } | null
  genre?: string | { id: number; genre: string }
  rating?: string | { id: number; description: string; rating: string }
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

function getMovieTitle(movie: Movie) {
  return movie.movieName ?? movie.movieTitle ?? "Untitled movie"
}

function getGenre(movie: Movie) {
  if (typeof movie.genre === "string") {
    return movie.genre
  }

  return movie.genre?.genre ?? "Unknown"
}

function getRating(movie: Movie) {
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

export default function MoviesPage() {
  const queryClient = useQueryClient()
  const {
    data: movies = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["movies"],
    queryFn: async () => {
      const response = await fetch(MOVIES_API_URL)

      if (!response.ok) {
        throw new Error("Unable to load movies right now.")
      }

      return response.json() as Promise<Movie[]>
    },
  })

  async function handleDelete(id: number, title: string) {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${title}?\n\nThis action cannot be undone.`
    )

    if (!confirmed) return

    try {
      const response = await fetch(`http://localhost:8080/api/movies/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error()
      }

      await queryClient.invalidateQueries({ queryKey: ["movies"] })
    } catch {
      alert("Unable to delete movie.")
    }
  }

  return (
    <main className="relative mx-auto mb-20 flex min-h-screen w-full max-w-7xl flex-col gap-8 bg-slate-950 px-4 py-8 text-slate-100 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(96,165,250,0.16),transparent_32%),radial-gradient(circle_at_top_right,rgba(14,165,233,0.12),transparent_28%),linear-gradient(180deg,rgba(8,15,35,1)_0%,rgba(2,6,23,1)_100%)]" />
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-4xl font-semibold tracking-tight text-white">Movies</h1>

        <Link
          href="/movies/add"
          className="inline-flex items-center justify-center rounded-full bg-sky-50 px-5 py-3 text-md font-medium text-slate-950 transition hover:bg-sky-800"
        >
          Add Movie
        </Link>
      </div>
      {isLoading ? (
        <p className="rounded-2xl border border-sky-400/15 bg-sky-400/10 px-5 py-4 text-sky-100 shadow-sm backdrop-blur">Loading movies...</p>
      ) : isError ? (
        <p className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-rose-200">Unable to load movies right now.</p>
      ) : (
        <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {movies.map((movie) => (
            <Card key={movie.id} className="group overflow-hidden rounded-[1.75rem] border-sky-400/10 bg-slate-950/85 text-slate-100 shadow-[0_20px_60px_rgba(2,6,23,0.35)] backdrop-blur transition duration-300 hover:-translate-y-1 hover:border-sky-300/20 hover:bg-slate-900/85 hover:shadow-[0_24px_70px_rgba(2,6,23,0.5)]">
              <div className="relative aspect-16/10 overflow-hidden border-b border-white/10 bg-slate-900/80">
                {movie.posterPath ? (
                  <Image
                    src={getPosterUrl(movie.posterPath)}
                    alt={`${getMovieTitle(movie)} poster`}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-105"
                    sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-[radial-gradient(circle_at_top,rgba(148,163,184,0.2),transparent_55%),linear-gradient(180deg,rgba(15,23,42,1)_0%,rgba(2,6,23,1)_100%)] px-6 text-center text-sm uppercase tracking-[0.18em] text-slate-400">
                    Poster unavailable
                  </div>
                )}

                <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-950/25 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4">
                  <span className="rounded-full border border-white/10 bg-slate-950/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-slate-100 backdrop-blur">
                    {getRating(movie)}
                  </span>
                </div>
              </div>

              <CardHeader className="flex flex-row items-start justify-between gap-4 p-5 pb-0">
                <div className="space-y-2">
                  <CardTitle className="text-2xl tracking-tight text-white transition group-hover:text-slate-200">
                    <Link href={`/movies/${movie.id}`} className="hover:underline">
                      {getMovieTitle(movie)}
                    </Link>
                  </CardTitle>
                  <CardDescription className="text-sm text-slate-400">
                    Released {formatDate(movie.releaseDate)}
                  </CardDescription>
                </div>
              </CardHeader>

              <CardContent className="p-5 pt-5">
                <dl className="grid gap-4 rounded-2xl border border-sky-400/10 bg-slate-900/70 p-4 text-sm text-slate-200">
                  <div className="flex items-center justify-between gap-4">
                    <dt className="font-medium text-slate-400">Genre</dt>
                    <dd className="text-right font-medium text-slate-100">{getGenre(movie)}</dd>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <dt className="font-medium text-slate-400">Length</dt>
                    <dd className="text-right font-medium text-slate-100">{movie.movieLength} minutes</dd>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <dt className="font-medium text-slate-400">Director</dt>
                    <dd className="text-right font-medium text-slate-100">
                      {movie.director ? `${movie.director.firstName} ${movie.director.lastName}` : "Unknown"}
                    </dd>
                  </div>
                </dl>
              </CardContent>

              <CardFooter className="grid gap-3 p-5 pt-0 sm:grid-cols-2">
                <Link
                  href={`/movies/${movie.id}`}
                  className="inline-flex items-center justify-center rounded-full bg-sky-300 px-4 py-3 text-sm font-medium text-slate-950 transition hover:bg-sky-200"
                >
                  See Cast
                </Link>

                <button
                  type="button"
                  onClick={() => handleDelete(movie.id, getMovieTitle(movie))}
                  className="inline-flex items-center justify-center rounded-full border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm font-medium text-rose-100 transition hover:bg-rose-500/20"
                >
                  Delete
                </button>
              </CardFooter>
            </Card>
          ))}
        </section>
      )}

      <Footer />
    </main>
  )
}