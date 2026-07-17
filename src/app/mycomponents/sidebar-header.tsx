import Link from 'next/link'
import React from 'react'

function Mysidebarheader() {
  return (
    <nav className="grid gap-2
     rounded-[0.5rem] border border-white/20 bg-white/5 p-3 text-sm font-medium text-slate-100">
      <Link className="rounded-full px-4 py-2 transition hover:bg-white/10 hover:text-white" href='/' prefetch={false}>Home</Link>
      <Link className="rounded-full px-4 py-2 transition hover:bg-white/10 hover:text-white" href='/movies' prefetch={false}>Movies</Link>
      <Link className="rounded-full px-4 py-2 transition hover:bg-white/10 hover:text-white" href='/directors' prefetch={false}>Directors</Link>
      <Link className="rounded-full px-4 py-2 transition hover:bg-white/10 hover:text-white" href='/actors' prefetch={false}>Actors</Link>
    </nav>
  )
}

export default Mysidebarheader