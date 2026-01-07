import { Client, Storage, ID } from "node-appwrite";
import dotenv from "dotenv";
dotenv.config();
const client = new Client()
  .setEndpoint("https://nyc.cloud.appwrite.io/v1")
  .setProject(process.env.APPWRITE_PROJECT_ID) // ID của dự án Appwrite
  .setKey(process.env.APPWRITE_API_KEY); // API Key có quyền thao tác với Storage
const storage = new Storage(client);

export { storage, ID };
