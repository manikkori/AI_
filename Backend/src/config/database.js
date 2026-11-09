const mongoose = require("mongoose");

async function connectToDB() {
    const mongoUri = process.env.MONGO_URI;

    if (!mongoUri) {
        console.error("❌ ERROR: MONGO_URI is not set in the .env file.");
        console.error("👉 Please add MONGO_URI=<your-mongodb-connection-string> in Backend/.env");
        return;
    }

    try {
        await mongoose.connect(mongoUri);
        console.log(" Connected to MongoDB successfully.");
    } catch (err) {
        console.error("❌ MongoDB connection error:", err.message);
    }
}

mongoose.connection.on("disconnected", () => {
    console.warn("⚠️ MongoDB disconnected.");
});

mongoose.connection.on("reconnected", () => {
    console.log(" Reconnected to MongoDB.");
});

module.exports = connectToDB;
