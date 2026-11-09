const jwt = require("jsonwebtoken");
const tokenBlacklistModel = require("../models/blacklist.model");

async function authUser(req, res, next) {
    try {
        const token =
            req.cookies?.token ||
            (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")
                ? req.headers.authorization.split(" ")[1]
                : null);

        if (!token) {
            return res.status(401).json({
                message: "Authentication required. Token not provided."
            });
        }

        const isTokenBlacklisted = await tokenBlacklistModel.findOne({ token });

        if (isTokenBlacklisted) {
            return res.status(401).json({
                message: "Session expired or invalid. Please log in again."
            });
        }

        if (!process.env.JWT_SECRET) {
            console.error("JWT_SECRET missing in environment variables.");
            return res.status(500).json({ message: "Server authentication error." });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;

        next();
    } catch (err) {
        if (err.name === "TokenExpiredError") {
            return res.status(401).json({
                message: "Token expired. Please log in again."
            });
        }
        return res.status(401).json({
            message: "Invalid token. Authentication failed."
        });
    }
}

module.exports = { authUser };
