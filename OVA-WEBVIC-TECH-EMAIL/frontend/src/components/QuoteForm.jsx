import React, { useState, useMemo } from 'react'

export default function QuoteForm({ pricing, onSent }) {
  const [title, setTitle] = useState('')
  const [type, setType] = useState(pricing.website.types[0].value)
  const [platforms, setPlatforms] = useState([])
  const [features, setFeatures] = useState([])
  const [domain, setDomain] = useState(false)
  const [hosting, setHosting] = useState(false)
  const [budget, setBudget] = useState('')
  const [email, setEmail] = useState('')
  const [phonenumber, setPhonenumber] = useState('')

  const toggle = (arrSetter, arr, value) => {
    if (arr.includes(value)) arrSetter(arr.filter(a => a !== value))
    else arrSetter([...arr, value])
  }

  // compute range total as [min,max]
  const range = useMemo(() => {
    let min = pricing.website.base.min || 0
    let max = pricing.website.base.max || 0

    const t = pricing.website.types.find(x => x.value === type)
    if (t) { min += t.min||0; max += t.max||0 }

    for (const p of platforms) {
      const obj = pricing.website.platforms.find(x => x.value === p)
      if (obj) { min += obj.min||0; max += obj.max||0 }
    }

    for (const f of features) {
      const obj = pricing.website.features.find(x => x.value === f)
      if (obj) { min += obj.min||0; max += obj.max||0 }
    }

    if (domain) {
      const d = pricing.website.optional.find(x => x.value==='domain')
      if (d) { min += d.min; max += d.max }
    }
    if (hosting) {
      const h = pricing.website.optional.find(x => x.value==='hosting_first')
      if (h) { min += h.min; max += h.max }
    }

    return { min, max }
  }, [pricing, type, platforms, features, domain, hosting])

  function fmt(n){ return '₦' + n.toLocaleString() }

  async function handleSubmit(e){
    e.preventDefault()
    if (!email) { alert('Please enter your email'); return }
    const payload = {
      title, type, platforms, features, domain, hosting, budget, email, phonenumber, range: fmt(range.min)+' - '+fmt(range.max)
    }
  const res = await fetch('http://localhost:4000/api/quotes/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    const j = await res.json()
    if (j.success) {
      onSent({ estimate_id: j.estimate_id, payload })
    } else {
      alert('Error sending: ' + (j.message || 'unknown'))
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block font-medium">Project name</label>
        <input className="mt-1 border p-2 w-full rounded" value={title} onChange={e=>setTitle(e.target.value)} />
      </div>

      <div>
        <label className="block font-medium">Project Type</label>
        <select className="mt-1 border p-2 w-full rounded" value={type} onChange={e=>setType(e.target.value)}>
          {pricing.website.types.map(t => <option key={t.value} value={t.value}>{t.label} — {fmt(t.min)} - {fmt(t.max)}</option>)}
        </select>
      </div>

      <div>
        <label className="block font-medium">Platforms</label>
        <div className="flex flex-wrap gap-2 mt-2">
          {pricing.website.platforms.map(p => (
            <button type="button" key={p.value} className={`px-3 py-1 rounded ${platforms.includes(p.value)?'bg-blue-600 text-white':'bg-gray-200'}`}
              onClick={()=>toggle(setPlatforms, platforms, p.value)}>{p.label} ({fmt(p.min)} - {fmt(p.max)})</button>
          ))}
        </div>
      </div>

      <div>
        <label className="block font-medium">Extra Features</label>
        <div className="grid md:grid-cols-2 gap-2 mt-2">
          {pricing.website.features.map(f => (
            <label key={f.value} className="flex items-center gap-2 p-2 border rounded">
              <input type="checkbox" checked={features.includes(f.value)} onChange={()=>toggle(setFeatures, features, f.value)} />
              <div>
                <div className="font-semibold">{f.label}</div>
                <div className="text-sm text-gray-500">{f.description}</div>
              </div>
              <div className="ml-auto font-medium">{fmt(f.min)} - {fmt(f.max)}</div>
            </label>
          ))}
        </div>
      </div>

     {/* Optional Add-ons */}
<div className="mt-4">
  <h3 className="font-semibold mb-2">Optional Add-ons</h3>
  <div className="flex flex-col gap-2">
    <label className="flex items-center gap-2">
      <input
        type="checkbox"
        name="domain"
        checked={domain}
        onChange={() => setDomain(!domain)}
      />
      <span>Domain (₦35,000 / year)</span>
    </label>

    <label className="flex items-center gap-2">
      <input
        type="checkbox"
        name="hosting"
        checked={hosting}
        onChange={() => setHosting(!hosting)}
      />
      <span>Hosting (₦15,000 first month, ₦12,000 monthly)</span>
    </label>
  </div>
  <p className="text-xs text-gray-500 mt-1">These add-ons are optional — leave unchecked to skip.</p>
</div>


      <div>
        <label className="block font-medium">Your Budget </label>
        <input className="mt-1 border p-2 w-full rounded" value={budget} onChange={e=>setBudget(e.target.value)} placeholder="e.g. ₦150,000" />
      </div>

      <div className="border-t pt-4">
        <div className="flex justify-between items-center">
          <div className="text-lg font-semibold text-gray-700">Estimated total</div>
          <div className="text-xl font-bold">{fmt(range.min)} - {fmt(range.max)}</div>
        </div>
      </div>

      <div>
        <label className="block font-medium">Your Email (required)</label>
        <input type="email" className="mt-1 border p-2 w-full rounded" value={email} onChange={e=>setEmail(e.target.value)} placeholder="e.g. noreply@gmail.com" required />
      </div>

<div>
        <label className="block font-medium">Your phone number (required)</label>
        <input type="phonenumber" className="mt-1 border p-2 w-full rounded" value={phonenumber} onChange={e=>setPhonenumber(e.target.value)} placeholder="e.g. +2348012345678" required />
      </div>

      <div>
        <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded">Send </button>
      </div>
    </form>
  )
}
