import React from 'react'

function Footer() {
  return (
    <footer className='fixed bottom-0 left-0 w-full border-t border-white/10 bg-slate-950 py-4 text-center text-sm text-slate-400'>
        <div>© {new Date().getFullYear()} RouteCinema. All rights reserved.</div>
    </footer>
  )
}

export default Footer