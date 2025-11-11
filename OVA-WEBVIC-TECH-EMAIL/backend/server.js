require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const quotesRouter = require('./routes/quotes');
app.use('/api/quotes', quotesRouter);

// serve pricing-config.json for frontend convenience
app.get('/api/pricing', (req, res) => {
  res.sendFile(path.join(__dirname, 'pricing-config.json'));
});

// health
app.get('/api/health', (req, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));
