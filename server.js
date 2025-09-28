const express = require("express");
const multer = require("multer");
const cors = require("cors");
const app = express();

// إعداد multer (الملفات في الرام)
const upload = multer({ storage: multer.memoryStorage() });

app.use(cors());
app.use(express.static("views"));

// UTF-8 headers
app.use((req, res, next) => {
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  next();
});

// الصفحة الرئيسية
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

// API: رفع الملف
app.post("/api/fileanalyse", upload.single("upfile"), (req, res) => {
  if (!req.file) {
    return res.json({ error: "No file uploaded" });
  }

  // تأكد إن الاسم بيرجع UTF-8
  const fileName = Buffer.from(req.file.originalname, "latin1").toString("utf8");

  res.json({
    name: fileName,
    type: req.file.mimetype,
    size: req.file.size
  });
});

// تشغيل السيرفر
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log("Server is running on port " + port);
});
