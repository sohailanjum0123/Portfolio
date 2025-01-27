import express from "express";
import cors from "cors"
import cookieParser from "cookie-parser";
import errorHandler from "./utils/cast_validate_duplicate_Error.js";

const app = express();


app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));


app.use(express.json({limit: "16kb"}));
app.use(express.urlencoded({extended: true, limit:"16kb"}));
app.use(express.static("public"));
app.use(cookieParser());
app.use(errorHandler)

//Routes import

import userRouter from "./routes/userRoutes.js";
import productRouter from "./routes/productRoutes.js"


// Routes

//Routes Declaration
app.use("/api/v1/users", userRouter);
app.use("/api/v1/products", productRouter);

export {app}