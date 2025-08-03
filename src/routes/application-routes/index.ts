import { Router } from "express";
import { getPdfBuffer, userFreeTier, verifyToken } from "../../middlewares/application-routes";
import { Next, Req, Res } from "../../utils/types";
import upload from "../../utils/mutler/multer";
import summaryAndStore, { onlySummary } from "../../controller/application-routes";
import { ReasonPhrases, StatusCodes } from "http-status-codes";

const router = Router();

router.use(verifyToken);

// router.use(userFreeTier);
router.get("/:id", getPdfBuffer, onlySummary);

router.use(upload.single("files")); // middleware that is used to extract multi-part/format-data

router.get("/", userFreeTier, summaryAndStore);

export default router;

/*

    "multi-part/form-data" is a "content-type" just like "application/json" ( this tells backend that JSON data is sent from the frontend ) used when submitting form data from the frontend to the backend

    when submitting JSON data to the body from the frontend we mention content-type as "application/json" similary when attaching form-data (data from inputs) to body from the frontend we define content-type as "multi-part/form-data"

    "multer" is used to attach the "form-data" (works when content-type is multi-part/form-data) to the req.body just like express.json attaches body data to the req["body"]
*/

