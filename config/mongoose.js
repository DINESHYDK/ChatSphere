import mongoose from "mongoose";
import debug from "debug";

const dbgr = debug("development:mongoose");
mongoose.set("debug", true);

const MONGODB_URI =
  process.env.MONGO_URI || "mongodb://localhost:27017/ChatSphere";

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export default async function connectToDatabase() {
  dbgr("Attempting DB connection...");

  if (cached.conn) {
    dbgr("Using cached DB connection");
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI) // no options needed in Mongoose v7+
      .then((mongooseInstance) => {
        dbgr("MongoDB connected successfully.");
        return mongooseInstance; // <-- NO extra brace
      })
      .catch((err) => {
        dbgr("MongoDB connection error:", err.message);
        console.error("MongoDB connection error:", err);
        throw err;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
