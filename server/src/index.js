// server/src/index.js
const path = require('path');
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
// const { cleanOldTempFiles } = require('./line/services/mediaService');

const app = express();

// โหลด env ตาม NODE_ENV
const envPath = process.env.NODE_ENV === 'production'
  ? path.join(__dirname, '../.env.production')
  : path.join(__dirname, '../.env');
dotenv.config({ path: envPath });

// โหลด routes
const authRoutes = require('./routes/authRoutes');
const ticketRoutes = require('./routes/ticketRoutes');
const lineRoutes = require('./line/routes/lineRoutes');
const userRoutes = require('./routes/userRoutes');
const statsRoutes = require('./routes/statsRoutes');
const reportRoutes = require('./routes/reportRoutes');

// ตั้งค่า origin ที่อนุญาต
const allowedOrigins = [
  process.env.CLIENT_URL, // ใช้จาก .env
  // 'http://localhost:3000',
  // 'http://localhost:5000',
  /^https:\/\/[a-z0-9\-]+\.ngrok-free\.app$/, // รองรับ ngrok
  /^https:\/\/.*\.trycloudflare\.com$/,       // รองรับ cloudflare tunnel
  /^https:\/\/[a-z0-9\-]+\.loca\.lt$/,        // รองรับ localtunnel
  'https://puripat.online',
];

// CORS whitelist + credentials  (แก้เฉพาะส่วนนี้)
const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true); // อนุญาต Postman/curl
    const ok = allowedOrigins.some(o =>
      o instanceof RegExp ? o.test(origin) : o === origin
    );
    return ok ? callback(null, true) : callback(new Error('Not allowed by CORS'));
  },
  credentials: true, // ถ้าไม่ใช้คุกกี้สามารถเปลี่ยนเป็น false ได้
  methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],            // ✅ เพิ่ม
  allowedHeaders: ['Content-Type','Authorization','X-Requested-With'], // ✅ เพิ่ม
  optionsSuccessStatus: 204                                            // ✅ เพิ่ม
};
app.use(cors(corsOptions));
// ✅ ให้ตอบ OPTIONS ทุก path เพื่อให้ preflight ผ่าน
app.options('*', cors(corsOptions));

// ตรวจสอบ path webhook ก่อนใช้
const lineWebhookPath = process.env.LINE_WEBHOOK_PATH || '/webhook';
if (!lineWebhookPath.startsWith('/')) {
  throw new Error(`LINE_WEBHOOK_PATH ต้องขึ้นต้นด้วย / เช่น "/webhook" แต่ได้ "${lineWebhookPath}"`);
}
console.log(`LINE webhook listening at: /api/line${lineWebhookPath}`);

// LINE webhook ต้องใช้ raw body
app.post(`/api/line${lineWebhookPath}`, express.raw({
  type: 'application/json',
  verify: (req, res, buf) => {
    req.rawBody = buf.toString();
  }
}));

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static uploads
app.use('/uploads', express.static(path.join(__dirname, 'line/uploads')));

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/line', lineRoutes);
app.use('/api/users', userRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/reports', reportRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'UP', timestamp: new Date().toISOString() });
});

// require() มัน เป็นคำสั่งที่โหลดไฟล์ได้ทุกที่ ตอนแรกใช้ import แล้วมันพังตอน verify ใน line
// lazy load 🧹 เริ่มล้างไฟล์ temp อัตโนมัติทุก ๆ 30 นาที
// โดยจะลบเฉพาะไฟล์ที่ "อายุมากกว่า 60 วินาที" เท่านั้น
setInterval(() => {
  console.log(`🧹 ล้างไฟล์ temp (${new Date().toLocaleString('th-TH')})`);
  try {
    const { cleanOldTempFiles } = require('./line/services/mediaService');
    cleanOldTempFiles(60);
  } catch (err) {
    console.error('❌ ล้างไฟล์ temp ล้มเหลว:', err.message);
  }
}, 1000 * 60 * 10);

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} [${process.env.NODE_ENV}]`);
});
