// require('dotenv').config({path: './env'});
import dotenv from "dotenv";

import express from "express";
import connectDataBase from "./database/database.js";
const app = express();


dotenv.config({
    path: './env'
})

connectDataBase();























// ;(async()=>{
// try {
//     await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
//     app.on("error", ()=>{
//         console.log("OUR application don't talk to Database",error);
//         throw error;
//     })

//     app.listen(process.env.PORT, ()=>{
//         console.log(`App is listenting on port ${process.env.PORT}`)
//     })
// } catch (error) {
//     console.error("ERROR:",error);
//     throw error;
// }
// })()