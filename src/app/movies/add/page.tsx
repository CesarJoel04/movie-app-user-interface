"use client"

import { useEffect, useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import { useQueryClient } from "@tanstack/react-query"
import Footer from "../../mycomponents/footer"

interface Person {
  id: number
  firstName: string
  lastName: string
  dateOfBirth: string
}

interface Genre {
  id: number
  genre: string
}

interface Rating {
  id: number
  rating: string
}

const MOVIES_API_URL = "http://localhost:8080/api/movies"
const DIRECTORS_API_URL = "http://localhost:8080/api/directors"
const ACTORS_API_URL = "http://localhost:8080/api/actors"
const GENRES_API_URL = "http://localhost:8080/api/genres"
const RATINGS_API_URL = "http://localhost:8080/api/ratings"

export default function AddMoviePage() {
  const router = useRouter()
  const queryClient = useQueryClient()

  const [movieName, setMovieName] = useState("")
  const [movieLength, setMovieLength] = useState("")
  const [releaseDate, setReleaseDate] = useState("")
  const [trailerUrl, setTrailerUrl] = useState("")
  const [genreId, setGenreId] = useState("")
  const [ratingId, setRatingId] = useState("")
  const [directorId, setDirectorId] = useState("")
  const [actorIds, setActorIds] = useState<number[]>([])
  const [directors, setDirectors] = useState<Person[]>([])
  const [actors, setActors] = useState<Person[]>([])
  const [genres, setGenres] = useState<Genre[]>([])
  const [ratings, setRatings] = useState<Rating[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true)

        const [directorsResponse, actorsResponse, genresResponse, ratingsResponse] = await Promise.all([
          fetch(DIRECTORS_API_URL),
          fetch(ACTORS_API_URL),
          fetch(GENRES_API_URL),
          fetch(RATINGS_API_URL),
        ])

        if (!directorsResponse.ok || !actorsResponse.ok || !genresResponse.ok || !ratingsResponse.ok) {
          throw new Error("Unable to load data.")
        }

        const [directorsData, actorsData, genresData, ratingsData] = await Promise.all([
          directorsResponse.json(),
          actorsResponse.json(),
          genresResponse.json(),
          ratingsResponse.json(),
        ])

        setDirectors(directorsData)
        setActors(actorsData)
        setGenres(genresData)
        setRatings(ratingsData)
      } catch {
        setError("Unable to load required data for the form.")
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  function toggleActorId(actorId: number) {
    setActorIds((currentActorIds) =>
      currentActorIds.includes(actorId)
        ? currentActorIds.filter((currentActorId) => currentActorId !== actorId)
        : [...currentActorIds, actorId]
    )
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()

    if (actorIds.length === 0) {
      setError("Select at least one actor.")
      return
    }

    setIsSaving(true)
    setError("")

    try {
      const response = await fetch(MOVIES_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          movieTitle: movieName,
          movieLength: Number(movieLength),
          releaseDate,
          trailerUrl,
          genre: { id: Number(genreId) },
          rating: { id: Number(ratingId) },
          director: { id: Number(directorId) },
          actors: actorIds.map((actorId) => ({ id: actorId })),
        }),
      })

      if (!response.ok) {
        throw new Error("Unable to add movie.")
      }

      await queryClient.invalidateQueries({ queryKey: ["movies"] })

      router.push("/movies")
    } catch {
      setError("Unable to add movie.")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <main className="relative mb-20 min-h-screen bg-slate-950 px-4 py-8 text-slate-100 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(96,165,250,0.16),transparent_32%),radial-gradient(circle_at_top_right,rgba(14,165,233,0.12),transparent_28%),linear-gradient(180deg,rgba(8,15,35,1)_0%,rgba(2,6,23,1)_100%)]" />

      <div className="mx-auto flex w-full max-w-4xl flex-col gap-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-semibold tracking-tight text-white">Add Movie</h1>
        </div>

        {isLoading ? (
          <p className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-slate-300 backdrop-blur">
            Loading form data...
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="grid gap-5 rounded-[2rem] border border-white/10 bg-white/5 p-5 shadow-2xl shadow-slate-950/30 backdrop-blur sm:p-6">
            {error ? (
              <p className="rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-rose-200">
                {error}
              </p>
            ) : null}

            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-slate-200">Movie Name</label>
                <input
                  type="text"
                  value={movieName}
                  onChange={(e) => setMovieName(e.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-sky-400/40"
                  placeholder="Inception"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-200">Length</label>
                <input
                  type="number"
                  min="1"
                  value={movieLength}
                  onChange={(e) => setMovieLength(e.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-sky-400/40"
                  placeholder="148"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-200">Release Date</label>
                <input
                  type="date"
                  value={releaseDate}
                  onChange={(e) => setReleaseDate(e.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-sky-400/40"
                  required
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-slate-200">Trailer URL</label>
                <input
                  type="url"
                  value={trailerUrl}
                  onChange={(e) => setTrailerUrl(e.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-sky-400/40"
                  placeholder="https://www.youtube.com/embed/..."
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-200">Genre</label>
                <select
                  value={genreId}
                  onChange={(e) => setGenreId(e.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-slate-100 outline-none transition focus:border-sky-400/40"
                  required
                >
                  <option value="">Select a genre</option>
                  {genres.map((genre) => (
                    <option key={genre.id} value={genre.id}>
                      {genre.genre}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-slate-200">Director</label>
                <select
                  value={directorId}
                  onChange={(e) => setDirectorId(e.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-slate-100 outline-none transition focus:border-sky-400/40"
                  required
                >
                  <option value="">Select a director</option>
                  {directors.map((director) => (
                    <option key={director.id} value={director.id}>
                      {director.firstName} {director.lastName}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <fieldset className="space-y-3 rounded-3xl border border-white/10 bg-slate-950/50 p-4">
              <legend className="px-2 text-sm font-medium text-slate-200">Rating</legend>
              <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {ratings.map((rating) => (
                  <label
                    key={rating.id}
                    className="flex cursor-pointer items-start gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200 transition hover:bg-white/10"
                  >
                    <input
                      type="radio"
                      name="rating"
                      value={rating.id}
                      checked={ratingId === String(rating.id)}
                      onChange={(e) => setRatingId(e.target.value)}
                      className="mt-1 h-4 w-4 rounded-full border-white/30 bg-slate-950/70 text-sky-400 accent-sky-400"
                      required
                    />
                    <span>{rating.rating}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            <fieldset className="space-y-3 rounded-3xl border border-white/10 bg-slate-950/50 p-4">
              <legend className="px-2 text-sm font-medium text-slate-200">Actors</legend>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {actors.map((actor) => (
                  <label
                    key={actor.id}
                    className="flex cursor-pointer items-start gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200 transition hover:bg-white/10"
                  >
                    <input
                      type="checkbox"
                      checked={actorIds.includes(actor.id)}
                      onChange={() => toggleActorId(actor.id)}
                      className="mt-1 h-4 w-4 rounded border-white/30 bg-slate-950/70 text-sky-400 accent-sky-400"
                    />
                    <span>
                      {actor.firstName} {actor.lastName}
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => router.push("/movies")}
                className="inline-flex items-center justify-center rounded-full border border-white/10 px-5 py-3 font-medium text-slate-200 transition hover:bg-white/10"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSaving}
                className="inline-flex items-center justify-center rounded-full bg-sky-300 px-5 py-3 font-medium text-slate-950 transition hover:bg-sky-200 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSaving ? "Saving..." : "Save Movie"}
              </button>
            </div>
          </form>
        )}

        <Footer />
      </div>
    </main>
  )
}