import { Client, Storage, ID } from "node-appwrite";
import dotenv from "dotenv";
dotenv.config();
const client = new Client()
  .setEndpoint("https://nyc.cloud.appwrite.io/v1")
  .setProject(process.env.APPWRITE_PROJECT_ID)
  .setKey(process.env.APPWRITE_API_KEY);
const storage = new Storage(client);

export { storage, ID };
