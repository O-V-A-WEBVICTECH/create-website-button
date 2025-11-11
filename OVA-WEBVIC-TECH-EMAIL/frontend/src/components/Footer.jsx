import React from 'react'

export default function Footer(){
  return (
    <footer className="bg-gray-800 text-white mt-8">
      <div className="max-w-6xl mx-auto px-6 py-8 grid md:grid-cols-3 gap-6">
        <div>
          <div className="font-bold text-lg">O.V.A WEBVIC TECH</div>
          <p className="text-sm text-gray-300">AI-powered web solutions. Built by students, for the web.</p>
        </div>
        <div>
          <div className="font-semibold">Contact</div>
          <div className="text-sm text-gray-300">o.v.a.webvictech@gmail.com</div>
        </div>
        <div>
          <div className="font-semibold">Links</div>
          <div className="text-sm text-gray-300">Home • Analyzer • Pricing • Contact</div>
        </div>
      </div>
      <div className="text-center text-xs text-gray-400 py-3">© {new Date().getFullYear()} O.V.A WEBVIC TECH</div>
    </footer>
  )
}
