require("dotenv").config();
const app = require("./src/app");
const connectToDB = require("./src/config/database");

// Validate critical environment variables on startup
function checkEnvVariables() {
    const required = ["MONGO_URI", "JWT_SECRET", "GROQ_API_KEY"];
    const missing = required.filter((key) => !process.env[key]);

    if (missing.length > 0) {
        console.warn("==================================================");
        console.warn("⚠️  WARNING: Missing required environment variable(s):");
        missing.forEach((key) => console.warn(`   👉 ${key}`));
        console.warn("Please make sure to set these in your Backend/.env file.");
        console.warn("==================================================");
    }
}

checkEnvVariables();
connectToDB();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📡 Health check: http://localhost:${PORT}/api/health`);
});
