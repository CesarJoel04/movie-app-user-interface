"use client"

import { useQuery } from "@tanstack/react-query"
import AppCarousel from "./mycomponents/carousel"
import Footer from "./mycomponents/footer"

interface Movie {
  id: number
  movieName?: string
  movieTitle?: string
  overview: string
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

function shuffle(array: Movie[]) {
  let currentIndex = array.length,
    randomIndex

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex)
    currentIndex--
    ;[array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ]
  }

  return array
}

export default function Home() {
  const { data: movies = [] } = useQuery({
    queryKey: ["movies"],
    queryFn: async () => {
      const response = await fetch(MOVIES_API_URL)

      if (!response.ok) {
        throw new Error("Unable to load movies right now.")
      }

      return response.json() as Promise<Movie[]>
    },
  })

  const randomMovies = shuffle(movies).slice(0, 5)

  const featuredMovies = randomMovies.map((movie) => ({
    id: movie.id,
    title: getMovieTitle(movie),
    releaseDate: movie.releaseDate,
    runtime: movie.movieLength,
    trailerUrl: movie.trailerUrl,
    genre: getGenre(movie),
    rating: getRating(movie),
    poster: getPosterUrl(movie.posterPath),
    director: movie.director
      ? `${movie.director.firstName} ${movie.director.lastName}`
      : "Unknown",
    actors:
      movie.actors?.map(
        (actor: { firstName: string; lastName: string }) =>
          `${actor.firstName} ${actor.lastName}`
      ) ?? [],
    overview: movie.overview,
  }))

  return (
    <main className="relative min-h-[calc(100vh-var(--header-height))] overflow-x-hidden overflow-y-auto bg-slate-950 text-slate-100 lg:overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.12),transparent_30%),radial-gradient(circle_at_top_right,rgba(148,163,184,0.18),transparent_28%),linear-gradient(180deg,rgba(15,23,42,1)_0%,rgba(2,6,23,1)_100%)]" />
      <div className="pointer-events-none absolute -left-24 top-24 -z-10 h-64 w-64 rounded-full bg-slate-500/15 blur-3xl" />
      <div className="pointer-events-none absolute right-0 top-1/2 -z-10 h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl" />

      <section className="mx-auto flex w-full max-w-7xl flex-col gap-6 py-4 max-[430px]:gap-3 max-[430px]:py-3 sm:gap-8 sm:py-6 lg:py-12">
        <div className="grid items-end gap-8 max-[430px]:gap-3">
          <div className="bg-white/5 p-0 shadow-2xl shadow-slate-950/20 backdrop-blur sm:overflow-hidden">
            <div className="mb-4 flex w-full items-center justify-center px-3 text-center text-xl font-semibold uppercase tracking-[0.28em] text-slate-200 max-[430px]:mb-3 max-[431px]:px-2 max-[431px]:pt-3 sm:px-6 sm:pt-5 lg:px-8">
              <span>Top 5 Movies</span>
            </div>
            <AppCarousel movies={featuredMovies} />
          </div>
        </div>
        <div className="px-3 max-[430px]:px-2 sm:px-6 lg:px-8">
         <Footer />
        </div>
      </section>
    </main>
  )
}