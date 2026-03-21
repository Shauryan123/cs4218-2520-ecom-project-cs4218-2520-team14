import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

export default async function teardown() {
  await mongoose.disconnect();
  const mongod: MongoMemoryServer = (global as any).__MONGOD__;
  if (mongod) await mongod.stop();
}
