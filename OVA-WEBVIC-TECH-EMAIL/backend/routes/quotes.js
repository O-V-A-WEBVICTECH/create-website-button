const express = require('express');
const fs = require('fs');
const path = require('path');
const { nanoid } = require('nanoid');
const nodemailer = require('nodemailer');

const router = express.Router();
const DATA_DIR = path.join(__dirname, '..', 'data');
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

// Helper: create transporter using env - supports Gmail App Password or SMTP
function createTransporter() {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT) : undefined;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (host && user && pass) {
    return nodemailer.createTransport({
      host,
      port: port || 587,
      secure: port === 465,
      auth: { user, pass }
    });
  }

  // fallback to null (no transporter)
  return null;
}

// POST /api/quotes/send  — send quote details by email (no saving required)
router.post('/send', async (req, res) => {
  try {
    const payload = req.body;
    if (!payload) return res.status(400).json({ success: false, message: 'Missing payload' });

    // add id & timestamp
    const estimate_id = nanoid(10);
    const createdAt = new Date().toISOString();
    const record = { estimate_id, createdAt, payload };

    // Optional: save a copy for audit if DEBUG_SAVE env is set
    if (process.env.DEBUG_SAVE === 'true') {
      const filename = path.join(DATA_DIR, `${estimate_id}.json`);
      fs.writeFileSync(filename, JSON.stringify(record, null, 2), 'utf8');
    }

    // Build email content
    const receiver = process.env.RECEIVER_EMAIL || 'o.v.a.webvictech@gmail.com';
    const subject = `New Web Quote Submission - OVA WEBVIC TECH - ${estimate_id}`;
    let html = `<h3>New Web Quote Submission</h3><ul>`;
    html += `<li><strong>Estimate ID:</strong> ${estimate_id}</li>`;
    html += `<li><strong>Created At:</strong> ${createdAt}</li>`;
    html += `<li><strong>Project Name:</strong> ${payload.title || ''}</li>`;
    html += `<li><strong>Type:</strong> ${payload.type || ''}</li>`;
    html += `<li><strong>Platforms:</strong> ${Array.isArray(payload.platforms)?payload.platforms.join(', '):''}</li>`;
    html += `<li><strong>Features:</strong> ${Array.isArray(payload.features)?payload.features.join(', '):''}</li>`;
    html += `<li><strong>Domain:</strong> ${payload.domain? 'Yes' : 'No'}</li>`;
    html += `<li><strong>Hosting:</strong> ${payload.hosting? 'Yes' : 'No'}</li>`;
    html += `<li><strong>Budget:</strong> ${payload.budget || ''}</li>`;
    html += `<li><strong>Estimated Range:</strong> ${payload.range || ''}</li>`;
    html += `<li><strong>User Email:</strong> ${payload.email || ''}</li>`;
    html += `</ul><pre>${JSON.stringify(payload, null, 2)}</pre>`;

    // Send mail
    const transporter = createTransporter();
    if (transporter) {
      await transporter.sendMail({
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        to: receiver,
        subject,
        html
      });
      console.log('✅ Email sent successfully to', receiver);
    } else {
      // no SMTP configured - return the email content so dev can inspect
      console.warn('No SMTP configured - set SMTP_HOST, SMTP_USER, SMTP_PASS to send real email');
    }

    return res.json({ success: true, message: 'Submission sent', estimate_id });
  } catch (err) {
    console.error('send quote error', err);
    return res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
