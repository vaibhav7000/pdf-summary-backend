import { Router } from "express";
import { verifyToken } from "../../middlewares/application-routes";
import multer from "multer";
import { Next, Req, Res } from "../../utils/types";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import upload from "../../utils/mutler/multer";
import getTextFromBuffer from "../../utils/pdf-parser";
import summaryAndStore from "../../controller/application-routes";

const router = Router();

router.use(verifyToken);

router.use(upload.single("files")); // middleware that is used to extract multi-part/format-data

router.post("/", summaryAndStore,(req: Req, res: Res, next: Next) => {
    res.status(StatusCodes.OK).json({
        phrase: ReasonPhrases.OK,
        msg: "PDF saved successfully"
    })
});

export default router;

/*

    "multi-part/form-data" is a "content-type" just like "application/json" ( this tells backend that JSON data is sent from the frontend ) used when submitting form data from the frontend to the backend

    when submitting JSON data to the body from the frontend we mention content-type as "application/json" similary when attaching form-data (data from inputs) to body from the frontend we define content-type as "multi-part/form-data"

    "multer" is used to attach the "form-data" (works when content-type is multi-part/form-data) to the req.body just like express.json attaches body data to the req["body"]
*/

