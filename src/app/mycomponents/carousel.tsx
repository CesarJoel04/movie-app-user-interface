"use client"

import * as React from "react"
import Autoplay from "embla-carousel-autoplay"
import Image from "next/image"
import Link from "next/link"

import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

function formatDate(dateString: string) {
  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(dateString))
}

export type FeaturedMovie = {
  id: number
  title: string
  releaseDate: string
  runtime: number
  trailerUrl: string
  genre: string
  rating: string
  poster: string
  director: string
  actors: string[]
  overview: string
}

type AppCarouselProps = {
  movies: FeaturedMovie[]
}

export default function AppCarousel({ movies }: AppCarouselProps) {
  const plugin = React.useMemo(
    () => Autoplay({ delay: 7000 }),
    []
  )

  const truncateOverview = (overview: string, maxLength: number) => {
    if (overview.length <= maxLength) {
      return overview;
    }
    return overview.slice(0, maxLength) + "...";
  };

  return (
    <Carousel
      plugins={[plugin]}
      className="w-full max-[431px]:mx-auto max-[431px]:max-w-[calc(100vw-1rem)]"
      opts={{
        align: "start",
        loop: true,
      }}
    >
      <CarouselContent className="-ml-4 max-[431px]:ml-0">
        {movies.map((movie) => (
          <CarouselItem key={movie.id} className="pl-5 max-[431px]:w-full max-[431px]:pl-0 sm:pl-5">
            <Card className="w-full border-white bg-slate-950 text-slate-100 shadow-2xl shadow-slate-950/30 backdrop-blur sm:border-white/10 sm:bg-slate-950/90 sm:shadow-2xl sm:shadow-slate-950/30 sm:backdrop-blur">
              <CardContent className="grid gap-0 p-0 max-[431px]:p-3 lg:grid-cols-[1.05fr_0.95fr]">
                <div className="relative aspect-16/10  sm:aspect-16/11 lg:aspect-auto">
                  <Image
                    src={movie.poster}
                    alt={movie.title}
                    fill
                    priority={movie.id === movies[0]?.id}
                    className="object-contain bg-slate-950"
                    sizes="(min-width: 1024px) 50vw, 100vw"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-950/25 to-transparent" />
                </div>

                <div className="flex flex-col items-center justify-between gap-4 p-4 text-center max-[431px]:p-0 sm:gap-6 sm:p-8 lg:items-start lg:p-10 lg:text-left">
                  <div className="space-y-3 max-[431px]:space-y-2 sm:space-y-6">
                    <div className="flex flex-wrap items-center justify-center gap-3 lg:justify-start">
                      <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-slate-300">
                        {movie.rating}
                      </span>
                      <span className="text-sm text-slate-400">
                        Released {formatDate(movie.releaseDate)}
                      </span>
                    </div>

                    <div className="space-y-3">
                      <h3 className="text-xl font-semibold tracking-tight text-white sm:text-4xl">
                        {movie.title}
                      </h3>
                      <p className="max-w-md text-sm leading-5 text-slate-300 sm:text-base sm:leading-6">
                        {truncateOverview(movie.overview, 150)}
                      </p>
                    </div>

                    <dl className="mx-auto grid max-w-md gap-3 rounded-[1.5rem] border border-white/10 bg-white/5 p-4 text-sm text-slate-200 sm:gap-4 sm:p-5 lg:mx-0">
                      <div className="space-y-1">
                        <dt className="text-slate-400">Genre</dt>
                        <dd className="font-medium text-white">{movie.genre}</dd>
                      </div>
                      <div className="space-y-1">
                        <dt className="text-slate-400">Length</dt>
                        <dd className="font-medium text-white">{movie.runtime} minutes</dd>
                      </div>
                      <div className="space-y-1">
                        <dt className="text-slate-400">Director</dt>
                        <dd className="font-medium text-white">{movie.director}</dd>
                      </div>
                    </dl>
                  </div>

                  <Link
                    href={`/movies/${movie.id}`}
                    className="inline-flex w-9/12 items-center justify-center rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-slate-100 sm:py-3 sm:text-base lg:mx-0"
                  >
                    See Cast
                  </Link>
                </div>
              </CardContent>
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="-left-2 hidden border-white/10 bg-slate-950/85 text-white hover:bg-slate-900 sm:-left-5 sm:inline-flex" />
      <CarouselNext className="-right-2 hidden border-white/10 bg-slate-950/85 text-white hover:bg-slate-900 sm:-right-5 sm:inline-flex" />
    </Carousel>
  )
}