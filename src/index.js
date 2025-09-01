// require ('dotenv').config({path})
import dotenv from "dotenv";
import { app } from "./app.js";
import connectDB from "./db/index.js";

dotenv.config({
    path: './.env'
});
console.log("Cloudinary ENV check:", {
  name: process.env.CLOUDINARY_CLOUD_NAME,
  key: process.env.CLOUDINARY_API_KEY,
  secret: process.env.CLOUDINARY_API_SECRET ? "✅ loaded" : "❌ missing"
});


connectDB()
.then(() => {
    app.listen(process.env.PORT || 8000, () => {
        console.log(`app is running on port ${process.env.PORT || 8000}`);
    });
})
.catch((error) => {
    console.log("MONGO db connection failed!!:", error);
    throw error;
});
/*
import express from "express"
const app = express()

( async () => {
    try{
        await mongoose.connect(`${process.env.MONGODB_URI}/{DB_NAME}`)
        app.on ("error",() => {
            console.log("ERROR:" ,error);
            throw err
        })

        app.listen(process.env.PORT,() => {
            console.log(`app is running on port ${process.env.PORT}`);
        })
    }catch (error){
        console.error("ERROR:",error)
        throw err
    }
})()
    */