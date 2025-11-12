import React from 'react'

export default function Header(){ 
  return (
    <header className="bg-white shadow">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div>
             <div className="font-bold text-lg text-blue-600">O.V.A <span className="text-indigo-600">WEBVIC TECH</span></div>
            <div className="text-sm text-gray-500">INT' SERVICE LIMITED</div>
          </div>
        </div>
        <nav className="space-x-4 text-sm">
          <a href="/" className="text-gray-700 hover:text-blue-600">Home</a>
          <a href="#analysis" className="text-gray-700 hover:text-blue-600">Analyzer</a>
          <a href="/pricing" className="text-gray-700 hover:text-blue-600">Pricing</a>
          <a href="/contact" className="text-gray-700 hover:text-blue-600">Contact</a>
        </nav>
      </div>
    </header>
  )
}
