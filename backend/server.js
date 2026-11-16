require('dotenv').config();

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
    origin: 'https://ai-capsule-w0vs.onrender.com',
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "backend running"
  });
});

app.get("/api/test", (req, res) => {
  res.json({
    success: true,
    message: "test success"
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});