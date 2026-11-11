const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const app = express();

// Trust reverse proxy (essential for Render, Railway, Vercel for rate-limiting & secure cookies)
app.set("trust proxy", 1);

// Security Headers
app.use(helmet());

// Cross-Origin Resource Sharing
const rawClientUrl = (process.env.CLIENT_URL || "http://localhost:5173").replace(/\/$/, "");
const allowedOrigins = [
    rawClientUrl,
    "http://localhost:5173",
    "http://127.0.0.1:5173"
];

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps, curl, postman)
        if (!origin) return callback(null, true);
        
        const cleanOrigin = origin.replace(/\/$/, "");
        if (
            allowedOrigins.includes(cleanOrigin) ||
            cleanOrigin.endsWith(".vercel.app") ||
            process.env.NODE_ENV !== "production"
        ) {
            callback(null, true);
        } else {
            callback(new Error(`CORS blocked for origin: ${origin}`));
        }
    },
    credentials: true
}));

// Body parsers
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

// Rate Limiting
const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 300, // limit each IP to 300 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: "Too many requests from this IP, please try again after 15 minutes." }
});

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 40, // limit login/register attempts
    message: { message: "Too many authentication attempts, please try again after 15 minutes." }
});

const aiLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 15, // max 15 AI operations per minute per IP
    message: { message: "AI rate limit reached. Please wait a minute before making another request." }
});

app.use("/api/", generalLimiter);
app.use("/api/auth/login", authLimiter);
app.use("/api/auth/register", authLimiter);
app.use("/api/interview/report", aiLimiter);

/* Route handlers */
const authRouter = require("./routes/auth.routes");
const interviewRouter = require("./routes/interview.routes");

app.use("/api/auth", authRouter);
app.use("/api/interview", interviewRouter);

// Health check endpoint
app.get("/api/health", (req, res) => {
    res.status(200).json({ status: "OK", timestamp: new Date().toISOString() });
});

// Centralized Error Handling Middleware
app.use((err, req, res, next) => {
    console.error("Unhandled Application Error:", err);

    // Multer-specific error handling
    if (err.name === "MulterError") {
        if (err.code === "LIMIT_FILE_SIZE") {
            return res.status(400).json({ message: "File too large. Maximum allowed size is 5MB." });
        }
        return res.status(400).json({ message: `Upload error: ${err.message}` });
    }

    // Custom errors or standard file filter errors
    if (err.message && err.message.includes("Only PDF files are supported")) {
        return res.status(400).json({ message: err.message });
    }

    return res.status(err.status || 500).json({
        message: err.message || "An unexpected internal server error occurred."
    });
});

module.exports = app;
