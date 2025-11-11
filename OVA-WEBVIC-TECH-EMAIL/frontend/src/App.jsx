const API_BASE = import.meta.env.VITE_API_BASE || '';
import React, { useEffect, useState } from 'react'
import QuoteForm from './components/QuoteForm'
import QuoteResult from './components/QuoteResult'
import Header from './components/Header'
import Footer from './components/Footer'

export default function App() {
  const [pricing, setPricing] = useState(null)
  const [sent, setSent] = useState(null)

  useEffect(() => {
   fetch('http://localhost:4000/api/pricing')
      .then(r => r.json())
      .then(setPricing)
      .catch(err => console.error(err))
  }, [])

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow p-8 bg-slate-50">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow p-6">
          <h1 className="text-2xl font-bold mb-4 text-blue-600">O.V.A <span className="text-indigo-600">WEBVIC TECH <span className="text-gray-700">- Project Cost Estimator</span></span></h1>
          {!pricing ? (
            <p>Loading...</p>
          ) : !sent ? (
            <QuoteForm pricing={pricing} onSent={setSent} />
          ) : (
            <QuoteResult report={sent} />
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
