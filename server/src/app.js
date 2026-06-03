const express = require('express');
const cors = require('cors');

const app = express();
const allowedOrigins = process.env.FRONTEND_URL 
  ? process.env.FRONTEND_URL.split(',').map(url => url.trim()) 
  : [];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      
      if (allowedOrigins.length === 0 || allowedOrigins.includes(origin) || process.env.NODE_ENV !== 'production') {
        callback(null, true);
      } else {
        console.warn(`CORS blocked for origin: ${origin}`);
        callback(new Error('CORS not allowed'));
      }
    },
    credentials: true,
  })
);
app.use(express.json());

app.get("/",(req,res)=>{
    res.json({ success: true, message: "Welcome to LinkForge API" });
})
const authRoutes = require('./routes/auth.routes');
const urlRoutes = require('./routes/url.routes');
const redirectRoutes = require('./routes/redirect.routes');
const analyticsRoutes = require('./routes/analytics.routes');

app.use('/api/auth', authRoutes);
app.use('/api/urls', urlRoutes);
app.use('/', redirectRoutes);
app.use('/api/analytics', analyticsRoutes);

module.exports = app;