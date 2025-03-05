import Link from 'next/link'
import React from 'react'

function Header() {
  return (
    <div className="w-full border-b border-slate-600">
      <header className="w-[90%] sm:w-[80%] mx-auto py-4">
        <div className="flex justify-between items-center">
          <Link href={'/'} className='text-2xl font-bold'>
              Dice<span className="text-teal-400">Roller</span>
          </Link>
        </div>
      </header>
    </div>
  )
}

export default Header