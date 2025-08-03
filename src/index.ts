import dotenv from "dotenv";
dotenv.config();

import Express, { NextFunction, Request, Response }  from "express";
import { StatusCodes, ReasonPhrases } from "http-status-codes";
import prismaClient from "./db";
import redisClient from "./utils/redis";
import allRoutes from "./routes/all-routes";
import multer from "multer";

const app = Express();

(async () => {
    try {
        await prismaClient.$connect();

        await redisClient.connect();

        console.log("backend is connected with database");

        app.listen(process.env.PORT, () => {
            console.log("backend is up");
        })
    } catch (error) {
        console.log("error occured when connecting with the database");
    }
})();

app.use(Express.json());

app.use("/api/v1", allRoutes);



app.use(function(error: Error, req: Request, res: Response, next: NextFunction) {

    if(error) {

        if(error instanceof multer.MulterError) {

            if(error.code === "LIMIT_FILE_SIZE") {
                res.status(StatusCodes.REQUEST_TOO_LONG).json({
                    phrase: ReasonPhrases.REQUEST_TOO_LONG,
                    msg: `File size should be less than 10 MB. Current file size is ${req["file"]?.size}`
                })
                return
            }

            if(error.code === "LIMIT_UNEXPECTED_FILE") {
                res.status(StatusCodes.BAD_REQUEST).json({
                    phrase: ReasonPhrases.BAD_REQUEST,
                    msg: `Only accepts pdf files. ${req["file"]?.filename}`
                })
                return;
            }
        }

        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            phrase: ReasonPhrases.INTERNAL_SERVER_ERROR,
            msg: "Something up with the backend Try again later"
        })
        return;
    }
    next()
})

app.use(function(req: Request, res: Response, next: NextFunction) {
    res.status(StatusCodes.NOT_FOUND).json({
        phrase: ReasonPhrases.NOT_FOUND,
        msg: "Route does not found"
    })
})