const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
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