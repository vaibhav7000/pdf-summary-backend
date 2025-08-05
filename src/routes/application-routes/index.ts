import { Router } from "express";
import { getPdfBuffer, userFreeTier, verifyToken } from "../../middlewares/application-routes";
import { Next, Req, Res } from "../../utils/types";
import upload from "../../utils/mutler/multer";
import summaryAndStore, { onlySummary } from "../../controller/application-routes";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import prismaClient from "../../db";

const router = Router();

router.use(verifyToken);

// router.use(userFreeTier);
router.get("/pdfid/:id", getPdfBuffer, onlySummary);

router.get("/all", async (req: Req, res: Res, next: Next) => {
    try {
        const response = await prismaClient.pdf.findMany({
            where: {
                userId: req["decode"]?.id!
            }
        })

        const filter = response.map(pdf => {
            return {
                search: pdf.search,
                link: pdf.link
            }
        })

        res.status(StatusCodes.OK).json({
            phrase: StatusCodes.OK,
            pdfs: filter
        })
    } catch (error) {

    }
})

router.use(upload.single("files")); // middleware that is used to extract multi-part/format-data

router.post("/pdf", userFreeTier, summaryAndStore);


export default router;

/*

    "multi-part/form-data" is a "content-type" just like "application/json" ( this tells backend that JSON data is sent from the frontend ) used when submitting form data from the frontend to the backend

    when submitting JSON data to the body from the frontend we mention content-type as "application/json" similary when attaching form-data (data from inputs) to body from the frontend we define content-type as "multi-part/form-data"

    "multer" is used to attach the "form-data" (works when content-type is multi-part/form-data) to the req.body just like express.json attaches body data to the req["body"]
*/

