import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

let memoryServer;

export async function connectDB(uriFromEnv) {
  const uri = uriFromEnv || process.env.MONGODB_URI;

  try {
    if (uri) {
      await mongoose.connect(uri);
      console.log(`Connected to MongoDB at ${uri}`);
      return;
    }

    // Fallback to in-memory Mongo for local/dev without external DB
    memoryServer = await MongoMemoryServer.create();
    const memUri = memoryServer.getUri();
    await mongoose.connect(memUri);
    console.log("Connected to in-memory MongoDB");
  } catch (err) {
    console.error("Mongo connection error", err);
    throw err;
  }
}

export async function disconnectDB() {
  await mongoose.disconnect();
  if (memoryServer) {
    await memoryServer.stop();
  }
}

