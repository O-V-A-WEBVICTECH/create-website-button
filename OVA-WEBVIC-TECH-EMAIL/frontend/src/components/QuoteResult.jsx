import React from 'react'

export default function QuoteResult({ report }) {
  return (
    <div>
      <h2 className="text-xl font-bold mb-2">Estimate Sent</h2>
      <p className="mb-2">Estimate ID: <span className="font-mono">{report.estimate_id}</span></p>
      <p className="mb-4">We have sent your estimate details. We will contact you at the email you provided.</p>
    </div>
  )
}
