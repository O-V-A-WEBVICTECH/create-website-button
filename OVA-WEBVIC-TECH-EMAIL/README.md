O.V.A WEBVIC TECH - Estimator (Email submission version)
-----------------------------------------------------------

This version sends collected estimate details by email to the receiver defined in environment variables (RECEIVER_EMAIL)
and optionally via SMTP settings for real email sending.

Environment variables (recommended):
  # Receiver (default to o.v.a.webvictech@gmail.com)
  RECEIVER_EMAIL=o.v.a.webvictech@gmail.com

  # Optional SMTP (for real email sending). If not set, backend will not send real emails.
  SMTP_HOST=smtp.gmail.com
  SMTP_PORT=587
  SMTP_USER=your-smtp-username
  SMTP_PASS=your-smtp-password
  SMTP_FROM=Optional display-from address

  # Optional debug: save copies of submissions to backend/data
  DEBUG_SAVE=true

How to run (development):

1) Backend
   cd backend
   npm install
   npm run dev
   (server runs on http://localhost:4000)

2) Frontend
   cd frontend
   npm install
   npm run dev
   (Vite dev server, default http://localhost:5173)

Deployment notes:
- Frontend: Netlify / Vercel (build output from `npm run build` in frontend)
- Backend: Railway / Render (Node service)
- Make sure to set RECEIVER_EMAIL and SMTP_* environment variables on the hosting platform.
