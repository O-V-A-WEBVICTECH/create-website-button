import nodemailer from 'nodemailer'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ success:false, message:'Method not allowed' })

  const payload = req.body || {}
  const { title, type, platforms, features, domain, hosting, budget, email, phone, note } = payload

  if (!email || !budget || !phone) {
    return res.status(400).json({ success:false, message:'Missing required fields' })
  }

  try {
    const host = process.env.SMTP_HOST
    const port = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 465
    const user = process.env.SMTP_USER
    const pass = process.env.SMTP_PASS

    if (!host || !user || !pass) {
      console.warn('SMTP not configured; set SMTP_HOST, SMTP_USER, SMTP_PASS in env')
      return res.status(200).json({ success:true, message:'Received (SMTP not configured)', estimate_id: 'local' })
    }

    const transporter = nodemailer.createTransport({ host, port, secure: port===465, auth: { user, pass } })

    const receiver = process.env.RECEIVER_EMAIL || 'o.v.a.webvictech@gmail.com'
    const subject = `New Web Quote Submission - OVA WEBVIC TECH`
    const html = `
      <h3>New Web Quote Submission</h3>
      <ul>
        <li><strong>Project Name:</strong> ${title || ''}</li>
        <li><strong>Type:</strong> ${type || ''}</li>
        <li><strong>Platforms:</strong> ${Array.isArray(platforms)?platforms.join(', '):''}</li>
        <li><strong>Features:</strong> ${Array.isArray(features)?features.join(', '):''}</li>
        <li><strong>Domain:</strong> ${domain? 'Yes' : 'No'}</li>
        <li><strong>Hosting:</strong> ${hosting? 'Yes' : 'No'}</li>
        <li><strong>Budget:</strong> ${budget || ''}</li>
        <li><strong>Phone:</strong> ${phone || ''}</li>
        <li><strong>Email:</strong> ${email || ''}</li>
        <li><strong>Note:</strong> ${note || ''}</li>
      </ul>
      <pre>${JSON.stringify(payload, null, 2)}</pre>
    `

    await transporter.sendMail({ from: process.env.SMTP_FROM || user, to: receiver, subject, html })
    console.log('✅ Email sent successfully to', receiver)
    return res.status(200).json({ success:true, message:'Email sent', estimate_id: 'prod' })
  } catch (err) {
    console.error('send quote error', err)
    return res.status(500).json({ success:false, message: err.message })
  }
}
