// require('dotenv').config({path: './env'});
import dotenv from "dotenv";


import connectDataBase from "./database/database.js";
import { app } from "./app.js";


dotenv.config({
    path: './.env'
})

connectDataBase()
.then(()=>{
    app.listen(process.env.PORT, ()=>{
        console.log(` Server is running at port : ${process.env.PORT}`);
    })
})
.catch((error)=>{
    console.log("MongoDB connection Failed !!!", error)
});


















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